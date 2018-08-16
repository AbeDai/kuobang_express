let UserModel = require("../model/UserModel").UserModel;

let express = require('express');
let router = express.Router();

router.get('/list', function (req, res, next) {
    UserModel.find({}, (err, results) => {
        let users = [];
        for (let i = 0; i < results.length; i++) {
            let tempUser = results[i];
            users[i] = {
                username: tempUser.username,
                password: tempUser.password
            }
        }
        res.send(users);
    })
});

router.get('/register', function (req, res, next) {
    let newUser = new UserModel({
        username: 'admin',
        password: '123'
    });
    newUser.save((err) => {
        console.log('save status:', err ? 'failed' : 'success');
        res.send('save status:' + (err ? 'failed' : 'success'));
    });
});


module.exports = router;
