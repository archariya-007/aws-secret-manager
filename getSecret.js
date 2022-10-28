const victoria = require('./get-secret');

let secretId = 'bc_elfuerte_pubkey-tf';

var secret = victoria.getSecrets(secretId).then(result=> {
    console.info(result.pubKey);
    return result.pubKey;
});

