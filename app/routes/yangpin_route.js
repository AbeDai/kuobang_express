let express = require("express");
let checkUniqueYangPinBianHao = require("../util/check").checkUniqueYangPinBianHao;
let {yangPinList, yangPinCreate, yangPinDelete, yangPinUpdate, yangPinDetail, yangPinAddImage, yangPinDeleteImage} = require("../service/yangpin_service");
let router = express.Router();
let {body, validationResult} = require("express-validator/check");
let multer = require('multer');
let {checkYangPingEditAuthority} = require("../service/yangpin_service");
let {uploadImg, deleteImg} = require("../service/file_service");
let {resJson} = require("../util/response");

/**
 * 图片上传验证条件
 */
let imgFilter = function (req, file, cb) {
    let originalName = file.originalname;
    let lastIndex = originalName.lastIndexOf(".");
    let suffix = originalName.substring(lastIndex, originalName.length);
    req.isSuffixMatch = (suffix === ".png" || suffix === ".jpg" || suffix === ".jpeg");
    cb(null, true);
};
let imgUpload = multer({dest: "./uploads", fileFilter: imgFilter});


/**
 * 添加样品
 */
router.post("/add", [
    body("BianHao")
        .isString()
        .isLength({
            min: 5, max: 15
        })
        .withMessage("编号应为5-15位字符")
        .custom((value) => {
            return checkUniqueYangPinBianHao(value);
        })
        .withMessage("编号应为唯一字符"),
    body("PinZhong")
        .isString()
        .isLength({
            min: 2, max: 15
        })
        .withMessage("品种应为2-15位字符"),
    body("ShaZhi")
        .isFloat()
        .withMessage("纱织应为浮点数"),
    body("ChenFeng")
        .isString()
        .isLength({
            min: 1, max: 20
        })
        .withMessage("成分应为1-20位字符"),
    body("KeZhong")
        .isFloat()
        .withMessage("克重应为浮点数"),
    body("MenFu")
        .isFloat()
        .withMessage("门幅应为浮点数"),
    body("JiaGe")
        .isFloat()
        .withMessage("价格应为浮点数"),
    body("WeiZhi")
        .isString()
        .isLength({
            min: 1, max: 20
        })
        .withMessage("位置应为1-20位字符"),
    body("BeiZhu")
        .isString()
        .isLength({
            min: 0, max: 500
        })
        .withMessage("备注应为1-500位字符"),
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 创建样品
    yangPinCreate(req.userInfo.UserId, req.body.BianHao, req.body.PinZhong, req.body.ShaZhi, req.body.ChenFeng,
        req.body.KeZhong, req.body.MenFu, req.body.JiaGe, req.body.WeiZhi, req.body.BeiZhu, resJson => {
            res.json(resJson);
        });
});

/**
 * 编辑样品
 */
router.post("/edit", [
    body("YangPinID")
        .isString()
        .withMessage("样品编号应为字符串"),
    body("BianHao")
        .isString()
        .isLength({
            min: 5, max: 15
        })
        .withMessage("编号应为5-15位字符"),
    body("PinZhong")
        .isString()
        .isLength({
            min: 2, max: 15
        })
        .withMessage("品种应为2-15位字符"),
    body("ShaZhi")
        .isFloat()
        .withMessage("纱织应为浮点数"),
    body("ChenFeng")
        .isString()
        .isLength({
            min: 1, max: 20
        })
        .withMessage("纱织应为1-20位字符"),
    body("KeZhong")
        .isFloat()
        .withMessage("克重应为浮点数"),
    body("MenFu")
        .isFloat()
        .withMessage("门幅应为浮点数"),
    body("JiaGe")
        .isFloat()
        .withMessage("价格应为浮点数"),
    body("WeiZhi")
        .isString()
        .isLength({
            min: 1, max: 20
        })
        .withMessage("位置应为1-20位字符"),
    body("BeiZhu")
        .isString()
        .isLength({
            min: 0, max: 500
        })
        .withMessage("备注应为1-500位字符"),
], async function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 验证操作权限
    if (await checkYangPingEditAuthority(req.userInfo.UserId, req.userInfo.UserAuthority, req.body.YangPinID)) {
        // 编辑样品
        yangPinUpdate(req.body.YangPinID, req.body.BianHao, req.body.PinZhong,
            req.body.ShaZhi, req.body.ChenFeng, req.body.KeZhong, req.body.MenFu, req.body.JiaGe,
            req.body.WeiZhi, req.body.BeiZhu, resJson => {
                res.json(resJson);
            });
    } else {
        res.json(resJson(401, "token invalid"));
    }
});

/**
 * 添加样品图片
 */
router.post("/addImage", imgUpload.single('ImageFile'), [
    body("YangPinID")
        .isString()
        .withMessage("样品编号应为字符串"),
], async function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 验证操作权限
    if (await checkYangPingEditAuthority(req.userInfo.UserId, req.userInfo.UserAuthority, req.body.YangPinID)) {
        // 上传图片到OSS
        const {file, isSuffixMatch} = req;
        if (!isSuffixMatch) {
            // 图片格式出错，必须要png,jpg,jpeg
            return res.json(resJson(400, "图片格式出错"));
        } else if (!file) {
            // 文件不存在
            return res.json(resJson(400, "文件上传失败"));
        } else {
            uploadImg(file, result => {
                if (result.code === 200) {
                    // 上传OSS成功
                    yangPinAddImage(req.body.YangPinID, result.data.FileID, result.data.Url, resJson => {
                        res.json(resJson);
                    });
                } else {
                    // 上传OSS失败
                    return res.json(resJson(400, "上传OSS操作失败"));
                }
            });
        }
    } else {
        res.json(resJson(401, "token invalid"));
    }
});

/**
 * 删除样品图片
 */
router.post("/deleteImage", [
    body("YangPinID")
        .isString()
        .withMessage("样品编号应为字符串"),
    body("ImageID")
        .isString()
        .withMessage("样品图片编号应为字符串"),
], async function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 验证操作权限
    if (await checkYangPingEditAuthority(req.userInfo.UserId, req.userInfo.UserAuthority, req.body.YangPinID)) {
        yangPinDeleteImage(req.body.YangPinID, req.body.ImageID, resJson => {
            if (resJson.code === 200) {
                deleteImg(req.body.ImageID, (_) => {
                    res.json(resJson);
                });
            }
        });
    } else {
        res.json(resJson(401, "token invalid"));
    }
});

/**
 * 删除样品
 */
router.post("/delete", [
    body("YangPinID")
        .isString()
        .withMessage("样品编号应为字符串"),
], async function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 验证操作权限
    if (await checkYangPingEditAuthority(req.userInfo.UserId, req.userInfo.UserAuthority, req.body.YangPinID)) {
        // 删除样品
        yangPinDelete(req.userInfo.UserId, req.userInfo.UserAuthority, req.body.YangPinID, resJson => {
            res.json(resJson);
        });
    } else {
        res.json(resJson(401, "token invalid"));
    }
});

/**
 * 样品详情
 */
router.post("/detail", [
    body("YangPinID")
        .isString()
        .withMessage("样品编号应为字符串"),
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 样品详情
    yangPinDetail(req.body.YangPinID, resJson => {
        res.json(resJson);
    });
});

/**
 * 获取样品列表
 */
router.post("/list", [
    body("PageNum")
        .isInt()
        .withMessage("样品页码应为数字"),
    body("PageSize")
        .isInt()
        .withMessage("样品每页数量应为数字"),
    body("PinZhong")
        .optional({nullable: true}),
    body("ChenFeng")
        .optional({nullable: true}),
    body("ShaZhiMin")
        .optional({nullable: true}),
    body("ShaZhiMax")
        .optional({nullable: true}),
    body("KeZhongMin")
        .optional({nullable: true}),
    body("KeZhongMax")
        .optional({nullable: true}),
    body("MenFuMin")
        .optional({nullable: true}),
    body("MenFuMax")
        .optional({nullable: true})
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 获取样品列表
    yangPinList(req.body.PageNum, req.body.PageSize, req.body.PinZhong, req.body.ChenFeng,
        req.body.ShaZhiMin, req.body.ShaZhiMax,
        req.body.KeZhongMin, req.body.KeZhongMax,
        req.body.MenFuMin, req.body.MenFuMax, resJson => {
            res.json(resJson);
        });
});

module.exports = router;
