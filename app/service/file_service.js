let {FileModel} = require("../model/file_model");
let {resJson} = require("../util/response");
let {putFile, deleteFile} = require("../lib/oss");
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
        if (err) {
            return callback(resJson(500, err.toString()));
        }
        // 添加阔邦专用图片样式
        let fileUrl = resValue.url;
        // 保存文件到数据库
        let newFile = new FileModel({
            FileID: timeStamp,
            Name: finalFileName,
            Url: fileUrl,
            CreateTime: timeStamp,
        });
        newFile.save((err) => {
            if (err) {
                return callback(resJson(500, err.toString()));
            } else {
                return callback(resJson(200, {FileID : timeStamp, Name: finalFileName, Url: fileUrl, CreateTime: timeStamp}));
            }
        });
    });
}

/**
 * 删除图片
 */
function deleteImg(fileId, callback) {
    getImageById(fileId, result => {
        if (result.code === 200){
            // 查找图片信息
            let data = result.data;
            if (data){
                let fileName = data.Name;
                deleteFile(fileName, function (err, resValue) {
                    if (err) {
                        return callback(resJson(500, err.toString()));
                    }
                    // 从数据库中删除文件
                    FileModel.remove({FileID: fileId}, function (error) {
                        if (error) {
                            return callback(resJson(500, err.toString()));
                        } else {
                            return callback(resJson(200, "删除成功"));
                        }
                    });
                });
            } else {
                return callback(resJson(500, "图片不存在"));
            }
        }
    });
}

/**
 * 根据图片ID获取图片信息
 */
function getImageById(fileId, callback) {
    FileModel.findOne({
        "FileID": fileId,
    }, (err, result) => {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            callback(resJson(200, result));
        }
    });
}

module.exports = {uploadImg, deleteImg};

