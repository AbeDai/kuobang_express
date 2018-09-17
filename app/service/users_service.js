let getToken = require("../middleware/token").getToken;
let {resJson} = require("../util/response");
let UserModel = require("../model/user_model").UserModel;

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
 * 编辑用户信息
 */
function userEdit(userTel, nickName, password, state, authority, callback) {
    let conditions = {UserTel: userTel};
    let updates;
    if (password) {
        updates = {$set: {UserNick: nickName, UserPassword: password, UserState: state, UserAuthority: authority}};
    } else {
        updates = {$set: {UserNick: nickName, UserState: state, UserAuthority: authority}};
    }
    UserModel.update(conditions, updates, function (err) {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            callback(resJson(200, "更新成功"));
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
 * 重置用户密码
 */
async function userResetPassword(userTel, originPassword, newPassword) {
    let conditions = {UserTel: userTel, UserPassword: originPassword};
    let updates = {$set: {UserPassword: newPassword}};
    let result = await UserModel.update(conditions, updates);
    return result["n"] === 1 && result["nModified"] === 1;
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
                    UserId: results.UserId,
                    UserTel: results.UserTel,
                    UserNick: results.UserNick,
                    UserState: results.UserState,
                    UserAuthority: results.UserAuthority,
                };
                callback(resJson(200, {login: true, token: token, user: user}));
            } else {
                callback(resJson(200, {login: false}));
            }
        }
    })
}

module.exports = {userResetPassword, userCreate, userList, userLoginTel, userEdit};