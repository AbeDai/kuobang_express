let isInArray = require('../util/CollectionUtil').isInArray;
let sign = require('jsonwebtoken').sign;
let verify = require('jsonwebtoken').verify;
let {resJson} = require("../util/ResponseJsonUtil");

const secret = 'kuobang_secret';

function checkToken(excludePath) {
    let finalExcludePath = (excludePath && excludePath instanceof Array) ? excludePath : [];
    return function(req, res, next) {
        if (isInArray(finalExcludePath, req.path)) {
            // exclude path without verify token
            next();
        }else {
            // verify token
            let token = req.headers.authorization;
            if (token) {
                verify(token, secret, function (err, decoded) {
                    if (!err){
                        next();
                    }else {
                        res.json(resJson(401, "token invalid"))
                    }
                })
            }else {
                res.json(resJson(401, "token invalid"))
            }
        }
    }
}

function getToken(tel) {
    return sign({
        tel:tel
    }, secret, {
        expiresIn:  60 * 60 * 24 * 365 // 有效期一年
    });
}

module.exports = {checkToken, getToken};
