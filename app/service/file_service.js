let {FileModel} = require("../model/file_model");
let {resJson} = require("../util/response");
let {putFile} = require("../lib/oss");
let moment = require('moment');

/**
 * 上传图片
 */
function uploadImg(file, callback) {
    // 修改文件名
    let timeStamp = Date.now();
    let timeFormat = moment(timeStamp).format("YYYY-MM-DD HH:mm:ss.SSS");
    let originalName = file.originalname;
    let lastIndex = originalName.lastIndexOf(".");
    let suffix = originalName.substring(lastIndex,originalName.length);
    let fileName = originalName.substring(0, lastIndex);
    let finalFileName = `${fileName}_${timeFormat}${suffix}`;
    // 上传文件到OSS
    putFile(finalFileName, file.path, function (err, resValue) {
        // 添加阔邦专用图片样式
        let fileUrl = `${resValue.url}?x-oss-process=style/kuobang`;
        // 保存文件到数据库
        let newUser = new FileModel({
            FileID: timeStamp,
            Name: finalFileName,
            Url: fileUrl,
            CreateTime: timeStamp,
        });
        newUser.save((err) => {
            if (err) {
                callback(resJson(500, err.toString()));
            } else {
                callback(resJson(200, {FileID : timeStamp, Name: finalFileName, Url: fileUrl, CreateTime: timeStamp}));
            }
        });
    });
}

module.exports = {uploadImg};