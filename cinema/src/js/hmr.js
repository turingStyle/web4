var socket = io.connect();
socket.on('news',function(res){
	if(res.success==true){
		window.location.reload();
	}
})
