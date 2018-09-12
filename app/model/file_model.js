let mongoose = require('../config/mongoose_db');
let Schema = mongoose.Schema;

// 文件表结构
let FileSchema = new Schema({
    // 文件ID
    FileID: {type: String, unique: true},
    // 文件名
    Name: String,
    // 文件Url
    Url: String,
    // 文件上传时间
    CreateTime: String,
});

let FileModel = mongoose.model('file', FileSchema);

module.exports = {FileModel, FileSchema};