const jwt = require('jsonwebtoken');
const victoria = require('./get-secret');

const jwtOptions = {
    audience: process.env.AUDIENCE,
    issuer: process.env.TOKEN_ISSUER
  };

//token may expire, you'll need to get from elfu token
const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ODUwOCIsIlVzZXJUeXBlIjoiQ29tcGFueSIsIkJyb2tlcklEIjoiMCIsIkNvbXBhbnlJRCI6IjE1Mjk5Iiwic2NvcGUiOiJlbGZ1ZXJ0ZSIsImF1ZCI6Imh0dHBzOi8vaG9ydWNqN3cybS5leGVjdXRlLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbSIsImlzcyI6ImJlbmVmaXRzY29ubmVjdC5uZXQiLCJuYmYiOjE2NjczMTA4NzQsImV4cCI6MTY2NzM1NDA3NCwiaWF0IjoxNjY3MzEwOTEzfQ.ZXWl4zWipVd2NILOsFYAyvXfwFgVzEHTxAfI0AUy5S9dmY1iypxBGxm8kEoIBaLTpDXHSiZLXcguFddeKywep78CcZadhf3CyyZ7M9-_5NoN0pUozj9EvKizAuIeQxOgCwOjaCNP8tbBrVwZ0POLifyyYz1_ehRJVdRTAtnA6wlrvn-Zwce9vAqZQXee4Hsal8-Ykq2JNXTKgJp90R3jgk4z2KkmEzTSgbyknYjS6sbbD7mDHw1WmYs97VEbEIGW6KDOGBxtE9pdKxDyRka4pLvcSF_qg3tuJHxRx9FpMYnajF--8UyGdaxBVXH3xzT3A9QG68gQ5qhoJIszwqEUC91HFT4JRO_AkNYZJEVnQF1LoLgMKGK3JXZF5Lnl9al5IdPXUDg-rXWeIewddN-2za3YLBMgDmJSsO6lX8YhIszN689fFKq-4ja1p3aVRPsbi_v518aXKY7vyr5xY7xo_p4DbWRccNDBYtQYtPwkrKEAgNPrLgdliuXzGu7-AIu-BmwrSNTHdI2gV_SvRAJAoEKHf5tgwda4xR5wHmesR10L-mg6VEAp4jM78OH5zvtVtboYOSgLG8fFh6BF5C_Z9bfxgMToor1jJMJhbczuESaSJnA-v1zDgSyAucC3Nj7tNcdOm7zeYRY9QNdwcXqMXGBxSScgzRfC-G2YxgCkInE`;
const expToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxMjE1MCIsIlVzZXJUeXBlIjoiQWRtaW4iLCJCcm9rZXJJRCI6IjAiLCJDb21wYW55SUQiOiIwIiwibmJmIjoxNjY2OTEyMjMxLCJleHAiOjE2NjY5MTI0MTEsImlhdCI6MTY2NjkxMjIzMn0.O9Vdf4nVpvd4lsAF3gcQp2aSCa2jlmBA0STClucvbM6MyqfgZkMuoCxAuwE36263IOIPaWKDujqlWa9ziSF_hjG2ymgLUuCEKi157Nsp8jPJCeVaUy3DbBOmSIfltKOr9BR4E0a335cAGDft-0TbbCrTolJ1oaSmcxPq-At6vlnRiaa2HRRaWgTJ_QrNXyrbeoLRIKuWWz8i7zierm8TAVcVrcF1u-n_DVcuz4ROzRRmzkPFTqRa2nVxcRZNkl9pBW4sLPRcV_T7w10TS2ypVRc0VbRP6cM-IMBhR36AU_84vKIzY0M95bTVem6PPgcgas8BOIuq_UAdtT7OiDepQQ`;


let secretId = 'elfuerte_pubkey-tf';
let isValidRequest;

// get secret 
var secret = function () {
    'use strict';
    return victoria.getSecrets(secretId).then(p => p).catch(err => {
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
