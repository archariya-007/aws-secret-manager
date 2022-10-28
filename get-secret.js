const AWS = require("aws-sdk");
const region = 'us-east-1'

var credentials = new AWS.Credentials({
    accessKeyId: 'YOURID', secretAccessKey: 'YOURACCESSKEY', 
    sessionToken: 'SESSIONTOKEN'
  });

AWS.config.credentials = credentials;

const client = new AWS.SecretsManager({
    region: region,
});



const getSecrets = async (SecretId) => {
    const response = await new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId }, (err, result) => {
            if (err) reject(err);
            if (result) {
                resolve(result.SecretString);
            }
        });
    });
    return JSON.parse(response);
};

module.exports = { getSecrets };
