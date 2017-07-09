var mysql=require("mysql");
var dbconnect=function(){
	this.createServer=function(){
		var client=mysql.createConnection({
	        host:"localhost",
	        user:"root",
	        password:"root",
	        database:"cinema"
	    })
	    return client;
	}
	this.selectByUserNameAndPassWord = function(client,user,callback) {
	    client.query("SELECT user_id, user_name, user_pass,user_sex, user_email FROM USER u WHERE u.user_name=? AND u.user_pass=?",[user.userName,user.userPass],function (error,result) {
	            callback(result);
	
	        }
	    )
	}
}
module.exports=new dbconnect();
