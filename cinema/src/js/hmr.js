var socket=io.connect();
socket.on('news',function(res){
	if(res.success){
		console.log('更新成功')
		window.location.reload();
	}
})
