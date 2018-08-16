const mongoose = require('mongoose');

function mongooseDB() {
    // 连接mongodb数据库
    mongoose.connect("mongodb://cha:root@localhost:27017/kuobang");
    // 实例化连接对象
    let db = mongoose.connection;
    db.on('error', () => {
        console.log("Mongoose DB 连接失败");
    });
    db.once('open', () => {
        console.log("Mongoose DB连接成功");
    });
    return db;
}

module.exports = mongooseDB();