let UserModel = require("../model/user_model").UserModel;
let YangPinModel = require("../model/yangpin_model").YangPinModel;

/**
 * 验证手机号唯一性
 */
function checkUniqueUserTel(userTel) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({'UserTel': userTel}, (err, user) => {
            if (user !== null) {
                return reject();
            } else {
                return resolve();
            }
        });
    });
}

/**
 * 验证用户状态
 */
function checkUniqueUserState(state) {
    return new Promise((resolve, reject) => {
        if (state === 0 || state === 1) {
            return resolve();
        }else {
            return reject();
        }
    });
}

/**
 * 验证用户权限
 */
function checkUniqueUserAuthority(authority) {
    return new Promise((resolve, reject) => {
        if (authority === 0 || authority === 1) {
            return resolve();
        }else {
            return reject();
        }
    });
}

/**
 * 验证用户状态
 */
function checkMd5PasswordContainEmpty(password) {
    let md5 = /^[a-f0-9]{32}$/;
    return new Promise((resolve, reject) => {
        if (password === "" || md5.test(password)) {
            return resolve();
        }else {
            return reject();
        }
    });
}

/**
 * 验证样品编号唯一性
 */
function checkUniqueYangPinBianHao(binhao) {
    return new Promise((resolve, reject) => {
        YangPinModel.findOne({'BianHao': binhao}, (err, user) => {
            if (user !== null) {
                return reject();
            } else {
                return resolve();
            }
        });
    });
}

module.exports = {checkUniqueUserTel, checkUniqueUserState, checkUniqueUserAuthority, checkMd5PasswordContainEmpty, checkUniqueYangPinBianHao};