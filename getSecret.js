const victoria = require('./get-secret');

let secretId = 'elfuerte_pubkey-test-tf'; //aws secret manager

victoria.getSecrets(secretId).then(result=> {
    console.info(result);
    return result;
}).catch(err => {
    console.error(err.code);
    return null;
});

