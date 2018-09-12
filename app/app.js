let checkAuthorityToken = require("./middleware/token").checkAuthorityToken;
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index_route');
let usersRouter = require('./routes/users_route');
let yangPinRouter = require('./routes/yangpin_route');
let fileRouter = require('./routes/file_route');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '15mb', extended: true, parameterLimit: 1000000}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 跨域问题
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

// token
app.use(checkAuthorityToken(["/users/login"],
    [, "/users/edit", "/users/register"], []));

// route
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/yangPin', yangPinRouter);
app.use('/file', fileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err.stack);
    res.send(err.message);
});

module.exports = app;
