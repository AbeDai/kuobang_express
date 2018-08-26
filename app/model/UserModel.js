let mongoose = require('../config/MongooseDB');
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
    // 用户权限(﻿0:普通用户 1:管理员)
    UserAuthority: Number
});

let UserModel = mongoose.model('user', UserSchema);

module.exports = {UserModel, UserSchema};