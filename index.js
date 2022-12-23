/*
* Sample Lambda Authorizer to validate tokens originating from bcenroll
*/

const jwt = require('jsonwebtoken');
const SecretsManager = require('./secretManager');

const jwtOptions = {
  algorithms: "RS256",
  audience: process.env.AUDIENCE,
  issuer: process.env.TOKEN_ISSUER
};

const apiPermissions = [
  {
    "arn": `arn:aws:execute-api:<Region>:<AWSAccount>:*`,
    "resource": "*",
    "stage": "*",
    "httpVerb": "GET",
    "scope": "elfuerte"
  },
  {
    "arn": "arn:aws:execute-api:<Region>:<AWSAccount>:*",
    "resource": "*",
    "stage": "*",
    "httpVerb": "OPTIONS",
    "scope": "elfuerte"
  },
  {
    "arn": "arn:aws:execute-api:<Region>:<AWSAccount>:*",
    "resource": "*",
    "stage": "*",
    "httpVerb": "POST",
    "scope": "elfuerte"
  },
  {
    "arn": "arn:aws:execute-api:<Region>:<AWSAccount>:*",
    "resource": "*",
    "stage": "*",
    "httpVerb": "PUT",
    "scope": "elfuerte"
  },  
  {
    "arn": "arn:aws:execute-api:<Region>:<AWSAccount>:*",
    "resource": "*",
    "stage": "*",
    "httpVerb": "DELETE",
    "scope": "elfuerte"
  }
];

var generateIAMPolicy = function (user, scopeClaims) {
  'use strict';
  // Declare empty policy statements array
  var policyStatements = [];
  // Iterate over API Permissions
  for (var i = 0; i < apiPermissions.length; i++) {
    // Check if token scopes exist in API Permission
    if (scopeClaims.indexOf(apiPermissions[i].scope) > -1) { //for elfuerte we could add oidc scope or a custom scope of elfuerte, do we need too though? 
      // User token has appropriate scope, add API permission to policy statements
      policyStatements.push(generatePolicyStatement(apiPermissions[i].arn, apiPermissions[i].stage, apiPermissions[i].httpVerb, apiPermissions[i].resource, "Allow"));
    }
  }
  // Check if no policy statements are generated, if so, create default deny all policy statement
  if (policyStatements.length === 0) {
    var policyStatement = generatePolicyStatement("*", "*", "*", "*", "Deny");
    policyStatements.push(policyStatement);
  }
  return generatePolicy(user, policyStatements);
};


var updatePolicyWithRuntimeValues = function (region, accountID) {
  'use strict';

  // Iterate over API Permissions
  for (var i = 0; i < apiPermissions.length; i++) {
    apiPermissions[i].arn = apiPermissions[i].arn.replace("<Region>", region).replace("<AWSAccount>", accountID);
  }
};

var generatePolicyStatement = function (apiName, apiStage, apiVerb, apiResource, action) {
  'use strict';
  // Generate an IAM policy statement
  var statement = {};
  statement.Action = 'execute-api:Invoke';
  statement.Effect = action;
  var methodArn = apiName + "/" + apiStage + "/" + apiVerb + "/" + apiResource;
  statement.Resource = methodArn;
  return statement;
};

var generatePolicy = function (principalId, policyStatements) {
  'use strict';
  // Generate a fully formed IAM policy
  var authResponse = {};
  authResponse.principalId = principalId;
  var policyDocument = {};
  policyDocument.Version = '2012-10-17';
  policyDocument.Statement = policyStatements;
  authResponse.policyDocument = policyDocument;
  return authResponse;
};


var decodeToken = function (token) {
  'use strict';
  return jwt.decode(token, { complete: true });
}

const getToken = (params) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const tokenString = params.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }

  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
  }
  return match[1];
}

var verifyJwtToken = async function (token, decoded) {
  'use strict';
  var secretName = process.env.SECRET_NAME;
  var region = process.env.AWS_REGION;

  if (!decoded || !decoded.header) {
    throw new Error('invalid token');
  }

  var secret = await SecretsManager.getSecret(secretName, region);
  var result = jwt.verify(token, secret, jwtOptions);

  return result;
};

exports.handler = async function FOO(event, context) {
  // Declare Policy
  var isValidRequest = false;
  var iamPolicy = null;

  try {
    var token = getToken(event);
    var decoded = decodeToken(token);

    var data = await verifyJwtToken(token, decoded);
    var scopeClaims = data.scope;

    // Update API permissions with Account and Region
    updatePolicyWithRuntimeValues(process.env.AWS_REGION, context.invokedFunctionArn.split(":")[4]);
    iamPolicy = generateIAMPolicy(data.sub, scopeClaims);
    isValidRequest = true;

    //todo - pass claim values to the api endpoint
  }
  catch (err) {
    isValidRequest = false;
    console.log('Error:' + err);
  }

  if (isValidRequest == false) {
    var policyStatements = [];
    var policyStatement = generatePolicyStatement("*", "*", "*", "*", "Deny");
    policyStatements.push(policyStatement);
    iamPolicy = generatePolicy('user', policyStatements);
  }
  console.log('isValidRequest:' + isValidRequest);
  return iamPolicy;
};