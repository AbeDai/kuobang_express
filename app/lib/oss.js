const OSS = require("ali-oss");

let client = new OSS({
    region: "oss-cn-hongkong",
    accessKeyId: "LTAIYmEk6YraQDyH",
    accessKeySecret: "kGWX1W1wH7bCxYwDpRYla4ELfWAj6q"
});
client.useBucket("daiyibo");

/**
 * 上传文件
 * @param name 文件名
 * @param path 文件路径
 * @param callback 回调
 */
function putFile(name, path, callback) {
    client.put(name, path).then(function (resValue) {
        callback(null, resValue);
    }).catch(function (error) {
        callback(error, null);
    });
}

/**
 * 删除文件
 * @param name 文件名
 */
function deleteFile(name, callback) {
    client.delete(name).then(function (resValue) {
        callback(null, resValue);
    }).catch(function (error) {
        callback(error, null);
    });
}

module.exports = {putFile, deleteFile};
