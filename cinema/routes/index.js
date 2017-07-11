var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:action', function(req, res, next) {
	var name = req.params.action;
	var userName=req.session.username;  //从session中获取用户名
    var isLogined=!!userName;
	res.render('../views/'+name+'.html', { isLogined:isLogined,username:userName || '' });
	
});

module.exports = router;
