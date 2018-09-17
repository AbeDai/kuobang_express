
let express = require("express");
let router = express.Router();
let {body} = require("express-validator/check");
let validationResult = require("express-validator/check").validationResult;
let {userResetPassword, userCreate, userList, userLoginTel, userEdit} = require("../service/users_service");
let {checkUniqueUserTel, checkUniqueUserState, checkUniqueUserAuthority, checkMd5PasswordContainEmpty} = require("../util/check");
let {resJson} = require("../util/response");

/**
 * 用户列表
 */
router.post("/list", function (req, res) {
    // 创建用户
    userList(resJson => {
        res.json(resJson);
    });
});

/**
 * 登录
 */
router.post("/login", [
    body("UserTel")
        .isMobilePhone("zh-CN")
        .withMessage("手机号格式错误"),
    body("UserPassword")
        .isMD5()
        .withMessage("用户密码MD5加密格式错误")
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 创建用户
    userLoginTel(req.body.UserTel, req.body.UserPassword, resJson => {
        res.json(resJson);
    });
});

/**
 * 重置密码
 */
router.post("/resetPassword", [
    body("OriginPassword")
        .isMD5()
        .withMessage("原始密码MD5加密格式错误"),
    body("NewPassword")
        .isMD5()
        .withMessage("新密码MD5加密格式错误")
], async function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 创建用户
    let isSuccess = await userResetPassword(req.userInfo.UserTel, req.body.OriginPassword, req.body.NewPassword);
    if (isSuccess){
        res.json(resJson(200, {isSuccess: true, message: "更新成功"}))
    } else {
        res.json(resJson(200, {isSuccess: false, message: "密码出错"}))
    }
});

/**
 * 编辑
 */
router.post("/edit", [
    body("UserTel")
        .isMobilePhone("zh-CN")
        .withMessage("手机号格式错误"),
    body("UserNick")
        .isString()
        .isLength({
            min: 2, max: 10
        })
        .withMessage("用户昵称格式错误"),
    body("UserPassword")
        .custom((value => {
                return checkMd5PasswordContainEmpty(value);
        }))
        .withMessage("用户密码不为空且不是MD5加密"),
    body("UserState")
        .isInt()
        .custom((value) => {
            return checkUniqueUserState(value);
        })
        .withMessage("用户状态格式错误"),
    body("UserAuthority")
        .isInt()
        .custom((value) => {
            return checkUniqueUserAuthority(value);
        })
        .withMessage("用户权限格式错误")
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 编辑用户
    userEdit(req.body.UserTel, req.body.UserNick, req.body.UserPassword, req.body.UserState, req.body.UserAuthority, resJson => {
        res.json(resJson);
    });
});

/**
 * 注册
 */
router.post("/register", [
    body("UserTel")
        .isMobilePhone("zh-CN")
        .custom((value) => {
            return checkUniqueUserTel(value);
        })
        .withMessage("手机号格式错误"),
    body("UserNick")
        .isString()
        .isLength({
            min: 2, max: 10
        })
        .withMessage("用户昵称格式错误"),
    body("UserPassword")
        .isMD5()
        .withMessage("用户密码MD5加密格式错误"),
    body("UserState")
        .isInt()
        .custom((value) => {
            return checkUniqueUserState(value);
        })
        .withMessage("用户状态格式错误"),
    body("UserAuthority")
        .isInt()
        .custom((value) => {
            return checkUniqueUserAuthority(value);
        })
        .withMessage("用户权限格式错误")
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 创建用户
    userCreate(req.body.UserTel, req.body.UserNick, req.body.UserPassword, req.body.UserState, req.body.UserAuthority,
            resJson => {
        res.json(resJson);
    });
});


module.exports = router;
