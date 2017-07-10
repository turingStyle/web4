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
    res.render("detailPage");
});
module.exports = router;