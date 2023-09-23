const path = require('path');

module.exports = {
	entry: './src/main.ts',
	output: {
	  filename: 'bundle.js',
	  path: path.resolve(__dirname, 'dist'),
	},
   module: {
	rules: [
		{
		  test: /\.tsx?$/,
		  use: 'ts-loader',
		  exclude: /node_modules/,
		},
	],
   },
   resolve: {
    extensions: ['.tsx', '.ts', '.js'],
	alias: {
		"#state": path.resolve(__dirname, "src/state/"),
		"#types": path.resolve(__dirname, "src/types"),
		"#utility": path.resolve(__dirname, "src/utility"),
		"#events": path.resolve(__dirname, "src/events/")
	}
  },
  };