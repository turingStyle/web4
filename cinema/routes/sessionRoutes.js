var express = require('express');
var router = express.Router();

var mysql = require('./dbConnect.js');

//跳到场次添加页面
router.get('/insertSessions', function(req, res, next) {
	var movieId=req.query.id;
    res.render('sessionInsert',{movieId:movieId});
});
router.post('/insert', function(req, res, next) {
	var sessionData=req.body;
	var movieId=req.body.movieId;
//	console.log(sessionData);
	var client=mysql.createServer();
    mysql.insertSession(client,sessionData,function(result){
        console.info(result);
        if(result==1){
            res.redirect("/movie/sessionList?id="+movieId);
        }else{
            res.render("error");
        }
    })
});
//修改场次
router.get('/editPage', function(req, res, next) {
	var userName=req.session.username;  //从session中获取用户名
	var isLogined=!!userName;
    var sessionId=req.query.id;
    var client=mysql.createServer();
    mysql.selectSessionBySessionId(client,sessionId,function(result){
        res.render('sessionEdit',{sessionOne:result[0],isLogined:isLogined,username:userName || ''});
    })
});
router.post('/editSession', function(req, res, next) {
	var seDetial = req.body;
	var movieId=req.body.movieId;
    var client=mysql.createServer();
    mysql.editSession(client,seDetial,function (result) {
        if (result==1){
            res.redirect("/movie/sessionList?id="+movieId);
        }else{
            res.render('error');
        }
    })
});

router.get('/delete', function(req, res, next) {
    var sessionId=req.query.id;
    var movieId=req.query.movieId;
    var client=mysql.createServer();
    mysql.deleteSessionBySessionId(client,sessionId,function(result){
        if (result==1){
            res.redirect("/movie/sessionList?id="+movieId);
        }else{
            res.render('error');
        }
    })
});
module.exports = router;