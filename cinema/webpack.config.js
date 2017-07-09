var htmlWebpackPlugin=require('html-webpack-plugin');
var extractTextPlugin=require('extract-text-webpack-plugin');

var fs = require('fs');
var tplPath='./src/tpl';
var files = fs.readdirSync(tplPath);

var entry =setEntry(files);
var plugins=setPlugins(files);

module.exports={
	entry:entry,
	output:{
		filename:'js/[name]-bundle.js',
		path:__dirname+'/public',
		publicPath:'http://localhost:3000'
	},
	module:{
		rules:[
			{
				test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
				loader: 'url-loader'
			},
			{
				test:require.resolve("jquery"),
				loader:"expose-loader?$!expose-loader?jQuery"
			},
			{
				test:/\.html$/,
				loader:'html-loader'
			},
			{
				test:/\.css$/,
				loader:extractTextPlugin.extract({
					fallback:'style-loader',
					use:'css-loader!postcss-loader'
				})
			},
			{
				test:/\.js$/,
				loader:'babel-loader'
			}
		]
	},
	plugins:plugins
}

function setEntry(files){
	var entry={}
	for(var i=0;i<files.length;i++){
		var entryKey = files[i].substring(0,files[i].indexOf('.'));
		console.log(entryKey);
		entry[entryKey]='./src/js/'+entryKey+'.js';
	}
	return entry;
}


function setPlugins(files){
	var plugins=[new extractTextPlugin('css/[name].css')];
	for(var i=0;i<files.length;i++){
		var entryKey = files[i].substring(0,files[i].indexOf('.'));
		plugins.push(
			new htmlWebpackPlugin({
				filename:'../views/'+entryKey+'.html',
				template:'./src/tpl/'+entryKey+'.html',
				chunks:[entryKey]
			})
		)
	}
	return plugins;
}