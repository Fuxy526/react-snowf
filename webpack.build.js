var webpack = require('webpack');
var path = require('path');
var version = require('./package.json').version;

var banner = 
	'react-snowf v' + version + '\n' +
	'2017 (c) - Fuxy526\n' +
	'Released under the MIT License.';

module.exports = {
	entry: './src/components/snowf.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'react-snowf.js',
		libraryTarget: 'commonjs2'
	},
	externals: [
	  {'react': true}
	],
	plugins: [
		new webpack.BannerPlugin(banner)
	],
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'jsx-loader!babel-loader'}
		]
	}
};