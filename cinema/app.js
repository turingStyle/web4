var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs=require('ejs');
var session=require("express-session");
var identityKey="zd";

var index = require('./routes/index');
var user = require('./routes/user');
var movie = require('./routes/movie');
var seat = require('./routes/seat');
var sessionRoutes = require('./routes/sessionRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(cookieParser());
app.use(session({
    name: identityKey,//返回客户端的key的名称，默认为connect.sid,也可以自己设置。
    secret: 'lx',  // 用来对session id相关的cookie进行签名
    //store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: true,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    //rolling: true,//设置session不过期
    /*cookie: {
        maxAge: 100 * 1000  // 有效期，单位是毫秒
    }*/
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.use('/movie',movie);
app.use('/seat',seat);
app.use('/sessionRoutes',sessionRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
