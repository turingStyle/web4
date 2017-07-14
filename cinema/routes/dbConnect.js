var mysql = require("mysql");
var uuid = require("node-uuid");
var async=require("async");
var dbconnect=function(){
	this.createServer=function(){
		var client=mysql.createConnection({
	        host:"localhost",
	        user:"root",
	        password:"root",
	        database:"ciname"
	    })
	    return client;
	}
	this.selectByUserNameAndPassWord = function(client,user,callback) {
	    client.query("SELECT user_id, user_name, user_pass, user_sex, user_email FROM USER u WHERE u.user_name=? AND u.user_pass=?",[user.userName,user.userPass],
	    	function (error,result) {
	           callback(result);
	        }
	    )
	}
	//用户的注册
	this.zhuceUser=function(client,user,callback) {
	    client.query("INSERT INTO USER (user_id, user_name, user_pass,  user_sex, user_email) VALUES (?,?,?,?,?)",
	        [uuid.v4(),user.userName,user.userPass,user.userSex,user.userEmail],function (error,result) {
	            callback(result.affectedRows);
	        }
	    )
	}
	//查询所有电影
	this.selectMovie=function(client,callback){
		client.query("SELECT movie_id, movie_name, movie_time, movie_intro, movie_role, movie_director, movie_length, movie_pic FROM ciname.movie",function(error,result){
			callback(result);
		})
	}
	//根据电影id查询一条电影详情
	this.selectMovieById=function(client,movieId,callback){
		client.query("SELECT movie_id, movie_name, movie_time, movie_intro, movie_role, movie_director, movie_length, movie_pic FROM movie WHERE movie_id=?",[movieId],function(error,result){
			callback(result);
		})
	}
	//添加电影
	this.insertMovie=function(client,movie,newPath,callback){
    client.query("INSERT INTO movie(movie_id, movie_name, movie_time, movie_intro, movie_role, movie_director, movie_length, movie_pic) VALUES (?,?,?,?,?,?,?,?)",[uuid.v4(),movie.movieName[0],movie.movieTime[0],movie.movieIntro[0],movie.movieRole[0],movie.movieDirector[0],movie.movieLength[0],newPath],function(error,result){
        callback(result.affectedRows);
	    })
	}
	//商品删除
	this.deleteMovieByMovieId=function(client,movieId,callback){
	    client.query("DELETE FROM movie WHERE movie_id = ?",[movieId],function(error,result){
	        callback(result.affectedRows);
	    })
	}
	this.yanZhengMovieName=function(client,movieName,callback) {
	    client.query("select count(*) shuliang from movie m where m.movie_name=?",[movieName],function (error,result) {
	            callback(result[0].shuliang);
	        }
	    );
	}
	//商品修改
	this.editMovie=function(client,movie,url,callback){
	    client.query("UPDATE movie SET  movie_name = ?, movie_time = ?, movie_intro = ?, movie_role = ?, movie_director = ?, movie_length = ?, movie_pic = ? where movie_id = ? ",[movie.movieName[0],movie.movieTime[0],movie.movieIntro[0],movie.movieRole[0],movie.movieDirector[0],movie.movieLength[0],url,movie.movieId[0]],function(error,result){
	        callback(result.affectedRows);
	    })
	}
	//删除多个商品
	this.deleteManyMovieByMovieIds=function (client,movieIds,callback){
	    var jieguo=[];
	    var funs=[];
	    var y=0;
	    for (var i=0;i<movieIds.length;i++){
	        funs[i]=function (callback) {
	            client.query("DELETE FROM movie WHERE movie_id = ?",[movieIds[y]],function(error,result){
	                if(error){
	                    console.log("error:"+error.message);
	                    return err;
	                }
	                y++;
	                if(result.affectedRows==1){
	                    jieguo.push(result);
	                }
	                callback(error,jieguo.length);
	            })
	        }
	    }
	    async.series(funs,function (error,result) {
	        callback(jieguo.length);
	    })
	}
	this.selectSessionByMovieId=function(client,movieId,callback){
		client.query("SELECT m.movie_id, movie_name, movie_time, movie_intro, movie_role, movie_director, movie_length, movie_pic, session_id, session_time, movie_price, session_room, movie_type FROM movie m left join session s on m.movie_id=s.movie_id WHERE m.movie_id=?",[movieId],function(error,result){
			callback(result);
		})
	}
	//根据场次id查询座位
	this.selectSeatBySessionId=function(client,sessionId,callback){
		client.query("SELECT seat_id, n.session_id, seat_num, seat_state, n.movie_id, n.session_time, n.movie_price, n.session_room, n.movie_type ,m.movie_name FROM seat t LEFT JOIN SESSION n ON t.session_id=n.session_id LEFT JOIN movie m ON n.movie_id=m.movie_id WHERE n.session_id=?",[sessionId],function(error,result){
			callback(result);
		})
	}
	//根据座位id修改座位状态
	this.updateSeatState=function(client,seatIds,callback){
//		client.query("UPDATE seat SET seat_state = 0 WHERE seat_id IN (seatIdsStr)",function(error,result){
//			callback(result.affectedRows);
//		})
		var jieguo=[];
	    var funs=[];
	    var y=0;
	    for (var i=0;i<seatIds.length;i++){
	        funs[i]=function (callback) {
	            client.query("UPDATE seat SET seat_state = 0 WHERE seat_id =?",[seatIds[y]],function(error,result){
	                if(error){
	                    console.log("error:"+error.message);
	                    return err;
	                }
	                y++;
	                if(result.affectedRows==1){
	                    jieguo.push(result);
	                }
	                callback(error,jieguo.length);
	            })
	        }
	    }
	    async.series(funs,function (error,result) {
	        callback(jieguo.length);
	    })
	}
}
module.exports=new dbconnect();
