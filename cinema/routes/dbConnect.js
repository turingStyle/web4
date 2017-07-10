var mysql = require("mysql");
var uuid = require("node-uuid");
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
	           console.log(result);
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
			console.log(result)
			callback(result);
		})
	}		
}
module.exports=new dbconnect();
