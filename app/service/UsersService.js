let getToken = require("../middleware/Token").getToken;
let UserModel = require("../model/UserModel").UserModel;
let {resJson} = require("../util/ResponseJsonUtil");

/**
 * 创建用户列表
 */
function userCreate(userTel, userNick, userPassword, userState, userAuthority, callback) {
    let newUser = new UserModel({
        UserId: Date.now(),
        UserTel: userTel,
        UserNick: userNick,
        UserPassword: userPassword,
        UserState: userState,
        UserAuthority: userAuthority
    });
    newUser.save((err) => {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            callback(resJson(200, "注册成功"));
        }
    });
}

/**
 * 用户列表
 */
function userList(callback) {
    UserModel.find({}, (err, results) => {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            if (!results) {
                callback(resJson(200, []));
            } else {
                callback(resJson(200, results));
            }
        }
    })
}

/**
 * 登录用户
 */
function userLoginTel(userTel, userPassword, callback) {
    UserModel.findOne({
        "UserTel": userTel,
        "UserPassword": userPassword
    }, (err, results) => {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            if (results) {
                let token = getToken(userTel);
                let user = {
                    UserTel:results.UserTel,
                    UserNick:results.UserNick,
                    UserState:results.UserState,
                    UserAuthority:results.UserAuthority,
                };
                callback(resJson(200, {login: true, token: token, user: user}));
            } else {
                callback(resJson(200, {login: false}));
            }
        }
    })
}

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

module.exports = {userCreate, checkUniqueUserTel, checkUniqueUserState, checkUniqueUserAuthority, userList, userLoginTel};