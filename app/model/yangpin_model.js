let mongoose = require('../config/mongoose_db');
let Schema = mongoose.Schema;

// 样品表结构
let YangPinSchema = new Schema({
    // 样品ID
    YangPinID: {type: String, unique: true},
    // 用户ID
    UserID: String,
    // 编号
    BianHao: {type: String, unique: true},
    // 品种
    PinZhong: String,
    // 纱织
    ShaZhi: String,
    // 成分
    ChenFeng: String,
    // 克重
    KeZhong: Number,
    // 门幅
    MenFu: Number,
    // 价格
    JiaGe: Number,
    // 样品创建时间
    CreateTime: String,
});

let YangPinModel = mongoose.model('yangpin', YangPinSchema);

module.exports = {YangPinModel, YangPinSchema};