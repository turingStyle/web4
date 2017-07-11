var express = require('express');
var router = express.Router();

var mysql = require('./dbConnect.js');

/* GET home page. */
//用户登录
router.post('/login', function(req, res, next) {
	var user=req.body;
//  console.info(user);
    var client=mysql.createServer();
    mysql.selectByUserNameAndPassWord(client,user,function (result) {
        if(result.length>0){
            req.session.regenerate(function(err) {//初始化session
                req.session.user=result[0];
                req.session.username=result[0].user_name;
                return  res.json({"resultCode":1});
            })
        }else{
                return  res.json({"resultCode":0});
        }
    })
});
//用户注册
router.post('/zhuce', function(req, res, next) {
    var user=req.body;
//  console.info(user);
    var client=mysql.createServer();
    mysql.zhuceUser(client,user,function (result) {
        console.info(result);
        if(result==1){
          	res.render('success');
        }else{
            res.render('error');
        }
    });
});
//销毁session
router.get('/destory', function(req, res, next) {
    req.session.destroy();//session的销毁
    return res.redirect("/index");
});

module.exports = router;