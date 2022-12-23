const AWS = require("aws-sdk");
const region = 'us-east-1'

var credentials = new AWS.Credentials({
    accessKeyId: 'ASIAQNPOQQAA3RO5THUO', secretAccessKey: 'mb1rOVzIXs2mZKUJEIeb3oG7HszYTguYxRRAMmT4', 
    sessionToken: 'FwoGZXIvYXdzELv//////////wEaDPQZYGqpriYSb+DPbSKDAjOjsXUlVcElO7p6mcB8GcKsDgx0QwFfwzd61XicDPRqk/aEi+bqjMIiYXpfD5fffrAExzIctgbkBEV+Ps6HeKm64WMrxppq6eWG/LMhj2dfEP9ugv3WZUqyurbUQGOeOKTdw/BnZP8JiTBd53xE2CwnD0yCqh2UNpQjKiaRTHWU/o3AblxrTZAZXlxB8RLKsJxq4VGON7P6t3tM9TkdGEM2LnXYwyfWza+CpJ4GfBE672qkxYLt2QussS84xaamrsFdofA9cuGCUrIADhOQc3DMcHmMKlAik4w5h0p/cHyUIy+grQ/dHAYyBdRQBsjOKEqnjEaMjlr7XGaFEkeKweBr/fYota2FmwYyKyLQ8PUvsQKxDROtqKskNn3QixQAT4znEs06DPtt83UM0U/BhnNB64qCs38='
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
    return response;
};

module.exports = { getSecrets };
