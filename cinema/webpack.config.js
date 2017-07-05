var htmlWebpackPlugin = require("html-webpack-plugin");
var extractTextPlugin = require("extract-text-webpack-plugin");
module.exports={
	entry:{
		index:"./src/js/index.js"
	},
	output:{
		filename:"js/[name]-bundle.js",
		path:__dirname+"/public",
		publicPath:"http://localhost:3000"
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				loader: extractTextPlugin.extract({
		          	fallback: "style-loader",
		          	use: "css-loader!postcss-loader"
		        })
			},
			{
				test:/\.js$/,
				loader:"babel-loader"
			},
			{
				test:/\.html/,
				loader:"html-loader"
			},
			{
				test:require.resolve('jquery'),
				loader:'expose-loader?$!expose-loader?jQuery'
			},
			{
				test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
				loader: 'url-loader'
			}
		]
	},
	plugins:[
		new extractTextPlugin("css/[name].css"),
		new htmlWebpackPlugin({
			filename:"../views/index.html",
			template:"./src/tpl/index.html",
			chunks:["index"]
		})
	]
}
