var express = require('express');
var router = express.Router();

var mysql = require('./dbConnect.js'); 
var async = require('async');



/* GET home page. */
//查询场次
router.get('/selectSeat', function(req, res, next) {
	var sessionId = req.query.id;
	var client=mysql.createServer();
	mysql.selectSeatBySessionId(client,sessionId,function(result){
		console.log(result);
		var userName=req.session.username;  //从session中获取用户名
   	 	var isLogined=!!userName; 
		res.render('selectSeat',{seat:result,isLogined:isLogined,username:userName || ''})
		
	})
});

router.post('/jieSuan', function(req, res, next) {
	var order = {};
	var user=req.session.user;
	if(user!=undefined){
		var seatIdsStr=req.body.seatIdsStr;
	    var seatIds=seatIdsStr.split(',');
//		order.totalPrice=req.body.zongJia;
		order.price=req.body.price;
		order.userId=user.user_id;
		order.seatId=seatIds;
	    var client=mysql.createServer();
	    async.series({
	        one:function (callback) {
	            mysql.updateSeatState(client,seatIds,function(result){
			    	if(result==seatIds.length){
			    		res.json({resultCode:1,msg:"预定成功"})
			    	}else{
			    		res.json({resultCode:0,msg:"预定失败"})
			    	}
			    })
	            callback(null);
	        },
	        two:function (callback) {
	            mysql.insertOrder(client,order,function(result){
	           		
	            })
	            callback(null);
	        } 
	    },function (err,values) {
	
	    })
	}else{
		res.json({resultCode:2,msg:"请登录"})
	}
});
router.get('/alreadyPay', function(req, res, next) {
	var userName=req.session.username; 
    var isLogined=!!userName;           
    return res.render('order',{isLogined:isLogined,username:userName || ''});
});
router.post('/selectDingDan', function(req, res, next) {
	var user=req.session.user;
	if(user!=undefined){
		var userId=user.user_id;
		var userName=req.session.username;  //从session中获取用户名
		var isLogined=!!userName;
		var client=mysql.createServer();
		mysql.selectAlreadyPay(client,userId,function(result){
	 		return res.json({resultCode:1,seat:result,isLogined:isLogined,username:userName || ''});
		})
	}else{
		return res.json({resultCode:0,msg:'请登录'});
	}
});
module.exports = router;