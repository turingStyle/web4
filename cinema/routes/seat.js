var express = require('express');
var router = express.Router();

var mysql = require('./dbConnect.js');


/* GET home page. */
//查询场次
router.get('/selectSeat', function(req, res, next) {
	var sessionId = req.query.id;
	console.log(sessionId);
	var client=mysql.createServer();
	mysql.selectSeatBySessionId(client,sessionId,function(result){
		console.log(result);
		var userName=req.session.username;  //从session中获取用户名
   	 	var isLogined=!!userName; 
		res.render('selectSeat',{seat:result,isLogined:isLogined,username:userName || ''})
		
	})
});

router.post('/jieSuan', function(req, res, next) {
	var zongJia=req.body.zongJia;
    var seatIdsStr=req.body.seatIdsStr;
    var seatIds=seatIdsStr.split(',')
    var client=mysql.createServer();
    mysql.updateSeatState(client,seatIds,function(result){
    	if(result==seatIds.length){
    		res.json({resultCode:1,msg:"预定成功"})
    	}else{
    		res.json({resultCode:0,msg:"预定失败"})
    	}
    })
});

module.exports = router;