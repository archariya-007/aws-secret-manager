const victoria = require('./get-secret');

let secretId = 'bc_elfuerte_pubkey-tf'; //aws secret manager

var secret = victoria.getSecrets(secretId).then(result=> {
    console.info(result.pubKey);
    return result.pubKey;
});

