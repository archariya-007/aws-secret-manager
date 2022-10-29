const jwt = require('jsonwebtoken');
const victoria = require('./get-secret');

const jwtOptions = {
    audience: process.env.AUDIENCE,
    issuer: process.env.TOKEN_ISSUER
  };

//Arrange 100 years cert
const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxMjE1MCIsIlVzZXJUeXBlIjoiQWRtaW4iLCJCcm9rZXJJRCI6IjAiLCJDb21wYW55SUQiOiIwIiwibmJmIjoxNjY2MDM1NzY0LCJleHAiOjQ4MjE3MDkzNjQsImlhdCI6MTY2NjAzNTc2N30.ij540REg4lBggfS3rKrvyt-BWpEQtJxIEZOwnoL4qbQZd02pliNIbh543Vnyb-eBEcspaWNtrRschwW7HN2-HXIWZkOHnoiD8_yj0L6KbpzGEwB_jZXCRxUDa96uReDyIXhpKBTdGJY_5ST_T1eOY7-Y1B9P4IxfxsNgugjrcXY56hkzWIBf9mpq8aMe9Nf7kOcf2-916YgOJtDehV-Ixk5u7y0zfJBygzkRwIKZjmzPu0UgyNYXGv4Ytl8-6w6kyXMLJI3E-Eh9O0WKJDBrfKdoihjB8SywZrTjbR6F5BiXnbyGRXWNlo9vh1y_iUPVnBYdx2WdfkO1aZjvxNAvfg`;
const expToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxMjE1MCIsIlVzZXJUeXBlIjoiQWRtaW4iLCJCcm9rZXJJRCI6IjAiLCJDb21wYW55SUQiOiIwIiwibmJmIjoxNjY2OTEyMjMxLCJleHAiOjE2NjY5MTI0MTEsImlhdCI6MTY2NjkxMjIzMn0.O9Vdf4nVpvd4lsAF3gcQp2aSCa2jlmBA0STClucvbM6MyqfgZkMuoCxAuwE36263IOIPaWKDujqlWa9ziSF_hjG2ymgLUuCEKi157Nsp8jPJCeVaUy3DbBOmSIfltKOr9BR4E0a335cAGDft-0TbbCrTolJ1oaSmcxPq-At6vlnRiaa2HRRaWgTJ_QrNXyrbeoLRIKuWWz8i7zierm8TAVcVrcF1u-n_DVcuz4ROzRRmzkPFTqRa2nVxcRZNkl9pBW4sLPRcV_T7w10TS2ypVRc0VbRP6cM-IMBhR36AU_84vKIzY0M95bTVem6PPgcgas8BOIuq_UAdtT7OiDepQQ`;
const mockPubKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwmbD6iW3YGAOR/VsR1b9
6xS58I1FHgze3elT3PpN4/bsFs30+xy4RyDo5HxCzywNjVZdSyc/Tp8SSpFW6vZ8
Z1HE78Bv4GUYDNKTZV9QVCOLp8WUC7DRpwfrHqUssVQtWIJoZTwgEozLbfqDPZKl
nKUt5XRhrCX8at+A6sFCfgraseQVSN/C+eNBFEng8C1Xe7I21UR9K7rNj5mufhY8
+KJGJJkRUfk48PmFsLnub1x7D1a+0TUL8SIjCiRGgegLm2dBO/npzV88ZA9T9Phh
8BMtrZHO/lhGyEi/fW2CNwukV8UTw+81jujS6mqiGIbUVFeiVxQaPb7Dgug/2wPr
FQIDAQAB
-----END PUBLIC KEY-----`; // this what get stored in aws secret manager

let secretId = 'bc_elfuerte_pubkey-tf';
let isValidRequest;

// get secret 
var secret = function () {
    'use strict';
    return victoria.getSecrets(secretId).then(_ => _.pubKey).catch(err => {
        console.info(`ResourceNotFoundException: Secrets Manager can't find the specified secret.`);
        return null;
    });
};

let runForrestRun = async function () {
    let pubKey = await secret();

    if(pubKey === null){
        isValidRequest = false;
        return isValidRequest;
    }
        
    pubKey = `-----BEGIN PUBLIC KEY-----\n${pubKey}\n-----END PUBLIC KEY-----`;



    try {
        let data = jwt.verify(token, pubKey, jwtOptions);
        isValidRequest = true;
        console.info(data);
    } catch (err) {
        isValidRequest = false;
        console.log('Error:' + err);
    }

    console.info(`Is token valid request: ${isValidRequest}`);

};


runForrestRun();
