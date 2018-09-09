
let express = require("express");
let checkUniqueYangPinBianHao = require("../util/check").checkUniqueYangPinBianHao;
let {yangPinList, yangPinCreate, yangPinDelete, yangPinUpdate, yangPinDetail} = require("../service/yangpin_service");
let router = express.Router();
let {body} = require("express-validator/check");
let validationResult = require("express-validator/check").validationResult;
let {resJson} = require("../util/response");

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
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 创建样品
    yangPinCreate(req.userInfo.UserId, req.body.BianHao, req.body.PinZhong, req.body.ShaZhi, req.body.ChenFeng,
        req.body.KeZhong, req.body.MenFu, req.body.JiaGe, resJson => {
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
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 编辑样品
    yangPinUpdate(req.userInfo.UserId, req.userInfo.UserAuthority, req.body.YangPinID, req.body.BianHao, req.body.PinZhong, req.body.ShaZhi, req.body.ChenFeng,
        req.body.KeZhong, req.body.MenFu, req.body.JiaGe, resJson => {
            res.json(resJson);
        });
});

/**
 * 删除样品
 */
router.post("/delete", [
    body("YangPinID")
        .isString()
        .withMessage("样品编号应为字符串"),
], function (req, res) {
    // 验证参数格式
    let argumentError = validationResult(req);
    if (!argumentError.isEmpty()) {
        return res.json(resJson(400, argumentError.mapped()));
    }
    // 删除样品
    yangPinDelete(req.userInfo.UserId, req.userInfo.UserAuthority, req.body.YangPinID, resJson => {
            res.json(resJson);
        });
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
        .optional({nullable:true}),
    body("ChenFeng")
        .optional({nullable:true}),
    body("ShaZhiMin")
        .optional({nullable:true}),
    body("ShaZhiMax")
        .optional({nullable:true}),
    body("KeZhongMin")
        .optional({nullable:true}),
    body("KeZhongMax")
        .optional({nullable:true}),
    body("MenFuMin")
        .optional({nullable:true}),
    body("MenFuMax")
        .optional({nullable:true})
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
