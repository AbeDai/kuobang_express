let mongoose = require('../config/mongoose_db');
let Schema = mongoose.Schema;

// User表结构
let UserSchema = new Schema({
    // 用户ID
    UserId: {type: String, unique: true},
    // 手机号
    UserTel: {type: String, unique: true},
    // 用户昵称
    UserNick: String,
    // 用户密码(MD5值)
    UserPassword: String,
    // 用户状态(﻿0:离职 1:在职)
    UserState: Number,
    // 用户权限(﻿0:普通用户 1:管理员 2:root用户)
    UserAuthority: Number
});

let User_model = mongoose.model('user', UserSchema);

module.exports = {UserModel: User_model, UserSchema};