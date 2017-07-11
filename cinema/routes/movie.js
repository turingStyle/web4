var express = require('express');
var router = express.Router();

var mysql = require('./dbConnect.js');
var multiparty=require("multiparty");
var path=require("path");
var fs=require("fs");


/* GET home page. */
//查询场次
router.get('/sessionList', function(req, res, next) {
	var movieId = req.query.id;
//	console.log(movieId);
	var client=mysql.createServer();
	mysql.selectSessionByMovieId(client,movieId,function(result){
		console.log(result)
		res.render('sessionList',{session:result})
		
	})
});

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
//  console.log(userName);
    
	var movieId = req.query.id;
//	console.log(movieId);
	var client=mysql.createServer();
	mysql.selectMovieById(client,movieId,function(result){
//		console.log(result)
		res.render('detailPage',{movie:result[0],isLogined:isLogined,username:userName || ''})
		
	})
});
router.post('/session', function(req, res, next) {
	var movieId=req.body.movieId;
    var client=mysql.createServer();
    mysql.selectSessionByMovieId(client,movieId,function (result) {
        return  res.json({sessionList:result});
    })
});
//跳到添加页面
router.get('/insertPage', function(req, res, next) {
    res.render('movieInsert');
});
//验证电影名重复
router.post('/yanZhengMovieName', function(req, res, next) {
    var movieName=req.body.movieName;
    var client=mysql.createServer();
        mysql.yanZhengMovieName(client,movieName,function (result) {
            // console.info(result);
            if(result>0){
                res.json({"resultCode":1});
            }else{
                res.json({"resultCode":0});
            }
        })
});
router.post('/insert', function(req, res, next) {
    //编辑图片上传路径
    var uplujing=path.join(__dirname,"../public/img/");
    //设置图片上传路径 实例化multiparty
    var form=new multiparty.Form({uploadDir:uplujing});
    //上传开始
    form.parse(req,function (err,fields,files) {
//      console.info(JSON.stringify(files,null,2));
        if(err){
            console.info(err);
        }else{
            //图片重命名
            var inputFile=files.inputFile[0];
            var oldPath=inputFile.path;        //原路径
            var newPath=uplujing+inputFile.originalFilename;    //新路径
//          console.log(oldPath);
//          console.log(newPath);
            fs.rename(oldPath,newPath,function(err){
                if(err){
                    console.info("rename 失败");
                }else{
                	var client=mysql.createServer();
		            var movie=fields;
		            console.info(movie);
		            var url="/img/"+inputFile.originalFilename;
		            mysql.insertMovie(client,movie,url,function(result){
		                // console.info(result);
		                if(result==1){
		                    res.render("movieList");
		                }else{
		                    res.render("error");
		                }
		            })
                    console.info("rename sucessfully");
                }
            })
            
        }
    })
});
//删除用户
router.get('/delete', function(req, res, next) {
    var movieId=req.query.id;
    var client=mysql.createServer();
    mysql.deleteMovieByMovieId(client,movieId,function(result){
        // console.info(result);
        if (result==1){
            res.render("movieList");
        }else{
            res.render('error');
        }
    })
});
//修改电影
router.get('/editPage', function(req, res, next) {
    var movieId=req.query.id;
    var client=mysql.createServer();
    mysql.selectMovieById(client,movieId,function(result){
        // console.info(result);
        res.render('movieEdit',{movie:result[0]});
    })
});
router.post('/editMovie', function(req, res, next) {
    //编辑图片上传路径
    var upLuJing=path.join(__dirname,"../public/img/");
    //设置图片上传路径 并实例化得到form对象
    var form=new multiparty.Form({uploadDir:upLuJing});
    //开始上传
    form.parse(req,function(err,fields,files){
        // console.info(files);

        if(err){
            console.log('parse error: '+err);
        }else{
            var inputFile=files.inputFile[0];
            var cclj="";
            if(inputFile.originalFilename==""){
                cclj=fields.movieBeiYong[0];
            }else{
                var oldpath=inputFile.path;
                var newpath=upLuJing+inputFile.originalFilename;
                // console.log("这个是旧路径"+oldpath);
                // console.log("这个是新路径"+newpath);
                fs.rename(oldpath,newpath,function (err) {
                    if (err){
                        console.log('rename error: '+err);
                    }else{
                        console.log('rename ok');
                    }
                })
                //获取原来文件的路径 自己拼接  其实就是那个没有用的文件 我要删了它
                var oldPath1=path.join(__dirname,"../public",fields.movieBeiYong[0]);
                fs.unlink(oldPath1, function (err) {
                    if (err) return console.log(err);
                    console.log('文件删除成功');
                })
                cclj="/img/"+inputFile.originalFilename;

            }
            var client=mysql.createServer();
            var movie =fields;
            // console.log(cclj);
            mysql.editMovie(client,movie,cclj,function (result) {
                if (result==1){
                    res.render("movieList");
                }else{
                    res.render('error');
                }
            })
        }
    })
});
//删除多个
router.post('/deleteMany', function(req, res, next) {
    var movieIdsStr=req.body.movieIdsStr;
    var movieIds=movieIdsStr.split(",");
    var client=mysql.createServer();
    mysql.deleteManyMovieByMovieIds(client,movieIds,function(result){
        if (result==movieIds.length){
            return res.json({resultCode:1});
        }else{
            return res.json({resultCode:0});
        }
    })
});
module.exports = router;