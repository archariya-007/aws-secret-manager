const jwt = require('jsonwebtoken');
const victoria = require('./get-secret');

const jwtOptions = {
    audience: process.env.AUDIENCE,
    issuer: process.env.TOKEN_ISSUER
  };

//token may expire, you'll need to get from elfu token
const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ODUwOCIsIlVzZXJUeXBlIjoiQ29tcGFueSIsIkJyb2tlcklEIjoiMCIsIkNvbXBhbnlJRCI6IjE1Mjk5Iiwic2NvcGUiOiJlbGZ1ZXJ0ZSIsImF1ZCI6Imh0dHBzOi8vaG9ydWNqN3cybS5leGVjdXRlLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbSIsImlzcyI6ImJlbmVmaXRzY29ubmVjdC5uZXQiLCJuYmYiOjE2NjcyNDI3NjksImV4cCI6MTY2NzI0MzY2OSwiaWF0IjoxNjY3MjQyNzY5fQ.bk7s4HxPh4KIUQz4Z5qqJJK6BkqHiiqjAmrl0KzKWwCHfjUSMd9zVDx6ynAwn63VEzKbCIFTVZ9ym5qXHFNq7umnKBRw8Le0PDP1UlN5zQGJ06ltgPHBcMVlfzFlb-ypjwHIYxMxf1pvtC6D_GFrjb0tV1whikZoBhGT5jer_3vbqGmgEj0Pe7BUuiICrxMRWkHaWkEnMkBkUOFdWMxTqVRE_OaR9p_FwC8iWWoKtcSbzDPJ98qqWfcRoXOatPAsLOTp2biavPFb5VDr7d6R0gCW2tfrzoifFVficnRUMbA6_2eRcKNrOqJKnGZWu07dCMt2VIjbuDu-5E20Q_LPDb9HwjJE0RAh8zgAU7On1wuC2trM91dYsEcAVxbDAxxOm9BLpJM_idJ9afS83_c5GhSTP2gOvbN3Z3Aj9DdXrPaR7Yz815ZMYKox1f1FcYRqi4W6SNQi-NB7e8j5hpanx4_cZtqUVCyZ0eFzW1TRxrVUkeq7zAcFFscq7TG06xKJbrNdXWQsG7A394z2eqZ_3VCfgsi-SPqD_wLFkVNRkFkXb7qQg6Ts9BhI1a1hZDItNMcKrccs10PGeaJATKLdxAzAafrCmVcuqZKH03F9iwhL0NeGtQJFmEhUVjivRTUM3W4-i88R0aQfvl08UcjEGL3wWXKbVthrWenkuIleoBY`;
const expToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxMjE1MCIsIlVzZXJUeXBlIjoiQWRtaW4iLCJCcm9rZXJJRCI6IjAiLCJDb21wYW55SUQiOiIwIiwibmJmIjoxNjY2OTEyMjMxLCJleHAiOjE2NjY5MTI0MTEsImlhdCI6MTY2NjkxMjIzMn0.O9Vdf4nVpvd4lsAF3gcQp2aSCa2jlmBA0STClucvbM6MyqfgZkMuoCxAuwE36263IOIPaWKDujqlWa9ziSF_hjG2ymgLUuCEKi157Nsp8jPJCeVaUy3DbBOmSIfltKOr9BR4E0a335cAGDft-0TbbCrTolJ1oaSmcxPq-At6vlnRiaa2HRRaWgTJ_QrNXyrbeoLRIKuWWz8i7zierm8TAVcVrcF1u-n_DVcuz4ROzRRmzkPFTqRa2nVxcRZNkl9pBW4sLPRcV_T7w10TS2ypVRc0VbRP6cM-IMBhR36AU_84vKIzY0M95bTVem6PPgcgas8BOIuq_UAdtT7OiDepQQ`;


let secretId = 'bc_elfuerte_pubkey-tf';
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
