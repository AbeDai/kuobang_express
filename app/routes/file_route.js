let express = require('express');
let router = express.Router();
let multer = require('multer');
let uploadImg = require("../service/file_service").uploadImg;
let {resJson} = require("../util/response");

let imgFilter = function (req, file, cb) {
    let originalName = file.originalname;
    let lastIndex = originalName.lastIndexOf(".");
    let suffix = originalName.substring(lastIndex,originalName.length);
    req.isSuffixMatch = (suffix === ".png" || suffix === ".jpg" || suffix === ".jpeg");
    cb(null, true);
};

let imgUpload = multer({dest: "./uploads", fileFilter: imgFilter});

/**
 * 上传单图
 */
router.post('/upload/img', imgUpload.single('img'), function (req, res) {
    const {file, isSuffixMatch} = req;
    if (!isSuffixMatch) {
        res.json(resJson(400, "图片格式出错"));
    }else if (!file) {
        res.json(resJson(400, "文件上传失败"));
    } else {
        uploadImg(file, resJson => {
            res.json(resJson);
        });
    }
});

module.exports = router;
