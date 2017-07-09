var express = require('express');
var router = express.Router();

var mysql = require('./dbConnect.js');

/* GET home page. */
router.post('/login', function(req, res, next) {
	var user=req.body;
    console.info(user);
    var client=mysql.createServer();
    mysql.selectByUserNameAndPassWord(client,user,function (result) {
        console.info(result);
        if(result.length>0){
            req.session.regenerate(function(err) {//初始化session
                req.session.user=result[0];
                req.session.username=result[0].user_name;
                return  res.json({"resultCode":1,"resultMsg":"恭喜登录成功"})
            })
        }else{
                return  res.json({"resultCode":0,"resultMsg":"登录失败,请重新登录"})
        }
    })
});

module.exports = router;