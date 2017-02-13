var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: './src/snowf.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'snowf.js',
		libraryTarget: 'commonjs2'
	},
	externals: [
	  {'react': true}
	],
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'jsx-loader!babel-loader'}
		]
	}
};