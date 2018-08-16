let express = require('express');
let router = express.Router();

router.get('/list', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
    let user = new User({
        username: 'admin',
        password: '123'
    });
    user.save((err) => { //添加
        console.log('save status:', err ? 'failed' : 'success');
    });
    res.send('respond with a resource');
});


module.exports = router;
