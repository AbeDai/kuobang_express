let YangPinModel = require("../model/yangpin_model").YangPinModel;
let UserModel = require("../model/user_model").UserModel;
let {resJson} = require("../util/response");

/**
 * 创建样品
 */
function yangPinCreate(userId, bianHao, pinZhong, shaZhi, chenFeng, keZhong, menFu, jiaGe, callback) {
    let curTime = Date.now();
    let newYangPin = new YangPinModel({
        YangPinID: curTime,
        UserID: userId,
        BianHao: bianHao,
        PinZhong: pinZhong,
        ShaZhi: shaZhi,
        ChenFeng: chenFeng,
        KeZhong: keZhong,
        MenFu: menFu,
        JiaGe: jiaGe,
        CreateTime: curTime,
    });
    newYangPin.save((err) => {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            callback(resJson(200, "创建成功"));
        }
    });
}

/**
 * 更新样品
 */
function yangPinUpdate(userId, authority, yangPinID, bianHao, pinZhong, shaZhi, chenFeng,
                       keZhong, menFu, jiaGe, callback) {
    let conditions;
    let updates = {
        $set: {
            BianHao: bianHao,
            PinZhong: pinZhong,
            ShaZhi: shaZhi,
            ChenFeng: chenFeng,
            KeZhong: keZhong,
            MenFu: menFu,
            JiaGe: jiaGe,
        }
    };
    if (authority === 1 || authority === 2) {
        conditions = {
            "YangPinID": yangPinID,
        };
        YangPinModel.update(conditions, updates, function (err) {
            if (err) {
                callback(resJson(500, err.toString()));
            } else {
                callback(resJson(200, "更新成功"));
            }
        });
    }else {
        conditions = {
            "YangPinID": yangPinID,
            "UserID":userId
        };
        YangPinModel.findOne({
            "YangPinID": yangPinID,
        }, (err, yangPin) => {
            if (err) {
                callback(resJson(500, err.toString()));
            } else {
                if (yangPin.UserID === userId) {
                    YangPinModel.update(conditions, updates, function (err) {
                        if (err) {
                            callback(resJson(500, err.toString()));
                        } else {
                            callback(resJson(200, "更新成功"));
                        }
                    });
                }else {
                    callback(resJson(401, "token invalid"));
                }
            }
        });
    }
}

/**
 * 删除样品
 */
function yangPinDelete(userId, authority, YangPinID, callback) {
    let criteria;
    if (authority === 1 || authority === 2) {
        criteria = {
            "YangPinID": YangPinID,
        };
    }else {
        criteria = {
            "YangPinID": YangPinID,
            "UserID":userId
        };
    }
    YangPinModel.remove(criteria, (err, results) => {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            callback(resJson(200, "删除成功"));
        }
    });
}

/**
 * 样品详情
 */
function yangPinDetail(YangPinID, callback) {
    YangPinModel.findOne({
        "YangPinID": YangPinID,
    }, (err, yangPin) => {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            UserModel.findOne({
                "UserId": yangPin.UserID,
            }, (err, user) => {
                if (err) {
                    callback(resJson(500, err.toString()));
                } else {
                    let data = {
                        YangPinID: yangPin.YangPinID,
                        UserID: yangPin.UserID,
                        UserNick: user.UserNick,
                        BianHao: yangPin.BianHao,
                        PinZhong: yangPin.PinZhong,
                        ShaZhi: yangPin.ShaZhi,
                        ChenFeng: yangPin.ChenFeng,
                        KeZhong: yangPin.KeZhong,
                        MenFu: yangPin.MenFu,
                        JiaGe: yangPin.JiaGe,
                        CreateTime: yangPin.CreateTime,
                    };
                    callback(resJson(200, data));
                }
            });
        }
    });
}

/**
 * 获取样品列表
 * @param pageNum 当前页面
 * @param pageSize 每一页有多少元素
 * @param callback 回调
 */
function yangPinList(pageNum, pageSize, callback) {
    YangPinModel.count({}, function (err, total) {
        if (err) {
            callback(resJson(500, err.toString()));
        } else {
            YangPinModel.find({}, (err, results) => {
                if (err) {
                    callback(resJson(500, err.toString()));
                } else {
                    let data = {};
                    data.total = total;
                    let list = [];
                    for (let i = 0; i < results.length; i++) {
                        list[i] = results[i]._doc;
                    }
                    data.list = list;
                    data.currentPageNum = pageNum;
                    callback(resJson(200, data));
                }
            }).skip(pageNum * pageSize).limit(pageSize);
        }
    });
}

module.exports = {yangPinCreate, yangPinDelete, yangPinUpdate, yangPinList, yangPinDetail};