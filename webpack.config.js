const webpack = require('webpack');

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		filename: "abi-parser.js",
		libraryTarget: "var",
		library: "AbiParser",
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader",
		},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			//"buffer": false,
			'buffer': require.resolve("buffer"),
			"stream": require.resolve('stream-browserify')
		}
	},
	plugins: [
		// Work around for Buffer is undefined:
		// https://github.com/webpack/changelog-v5/issues/10
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
	],

};
