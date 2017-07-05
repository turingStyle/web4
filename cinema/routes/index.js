var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:action', function(req, res, next) {
	var name = req.params.action;
  res.render('../views/'+name+'.html', { title: 'Express' });
});

module.exports = router;
