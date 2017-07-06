var htmlWebpackPlugin=require('html-webpack-plugin');
var extractTextPlugin=require('extract-text-webpack-plugin');
module.exports={
	entry:{
		main:'./src/js/index.js'
	},
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
	plugins:[
		new extractTextPlugin('css/[name].css'),
		new htmlWebpackPlugin({
			template:'./src/tpl/index.html',
			filename:'../views/index.html',
			chunks:['main']
		})
	]
}
