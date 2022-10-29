const victoria = require('./get-secret');

let secretId = 'bc_elfuerte_pubkey-tf2'; //aws secret manager

victoria.getSecrets(secretId).then(result=> {
    console.info(result.pubKey);
    return result.pubKey;
}).catch(err => {
    console.error(err.code);
    return null;
});

