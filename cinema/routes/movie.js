var express = require('express');
var router = express.Router();

var mysql = require('./dbConnect.js');

/* GET home page. */
//查询电影
router.post('/movieList', function(req, res, next) {
    var client=mysql.createServer();
    mysql.selectMovie(client,function (result) {
        return  res.json({list:result});
    })
});

router.get('/movie_detial', function(req, res, next) {
	var userName=req.session.username;  //从session中获取用户名
    var isLogined=!!userName; 
    console.log(userName);
    
	var movieId = req.query.id;
	console.log(movieId);
	var client=mysql.createServer();
	mysql.selectMovieById(client,movieId,function(result){
		console.log(result)
		res.render('detailPage',{movie:result[0],isLogined:isLogined,username:userName || ''})
	})
});

module.exports = router;