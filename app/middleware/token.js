let isInArray = require('../util/collection').isInArray;
let sign = require('jsonwebtoken').sign;
let verify = require('jsonwebtoken').verify;
let {resJson} = require("../util/response");
let UserModel = require("../model/user_model").UserModel;

const secret = 'kuobang_secret';

function checkAuthorityToken(excludePath, rootPath, managerPath) {
    let finalExcludePath = (excludePath && excludePath instanceof Array) ? excludePath : [];
    let finalRootPath = (rootPath && rootPath instanceof Array) ? rootPath : [];
    let finalManagerPath = (managerPath && managerPath instanceof Array) ? managerPath : [];
    return function(req, res, next) {
        if (isInArray(finalExcludePath, req.path)) {
            // 无需Token验证
            next();
        }else {
            // 需要Token验证
            let token = req.headers.authorization;
            if (token) {
                // 解码Token
                verify(token, secret, function (err, decoded) {
                    if (!err){
                        if (isInArray(finalRootPath, req.path)) {
                            // root权限验证
                            UserModel.findOne({
                                "UserTel": decoded.tel,
                            }, (err, results) => {
                                if (err) {
                                    res.json(resJson(401, "token authorization error"))
                                } else {
                                    if (results) {
                                        if (results.UserAuthority === 2) {
                                            req.userInfo = results;
                                            next();
                                        }else {
                                            res.json(resJson(401, "token authorization error"))
                                        }
                                    } else {
                                        res.json(resJson(401, "token authorization error"))
                                    }
                                }
                            });
                        }else if (isInArray(finalManagerPath, req.path)) {
                            // 管理员权限验证
                            UserModel.findOne({
                                "UserTel": decoded.tel,
                            }, (err, results) => {
                                if (err) {
                                    res.json(resJson(401, "token authorization error"))
                                } else {
                                    if (results) {
                                        if (results.UserAuthority === 1) {
                                            req.userInfo = results;
                                            next();
                                        }else {
                                            res.json(resJson(401, "token authorization error"))
                                        }
                                    } else {
                                        res.json(resJson(401, "token authorization error"))
                                    }
                                }
                            });
                        }else {
                            // 无需权限验证
                            // 获取用户
                            UserModel.findOne({
                                "UserTel": decoded.tel,
                            }, (err, results) => {
                                if (err) {
                                    res.json(resJson(401, "token authorization error"))
                                } else {
                                    if (results) {
                                        req.userInfo = results;
                                        next();
                                    } else {
                                        res.json(resJson(401, "token authorization error"))
                                    }
                                }
                            });
                        }
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

module.exports = {checkAuthorityToken, getToken};
