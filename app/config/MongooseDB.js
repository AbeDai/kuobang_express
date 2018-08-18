let mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/kuobang", {useNewUrlParser: true});

mongoose.connection.on('error', () => {
    console.log("Mongoose DB 连接失败");
});

mongoose.connection.on('open', () => {
    console.log("Mongoose DB连接成功");
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;