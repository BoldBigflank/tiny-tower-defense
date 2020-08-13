const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const CSSRule = {
    test: /\.s?[ac]ss$/,
    use: [{
        loader: 'style-loader'
    },
    {
        loader: 'css-loader',
        options: {
            sourceMap: true
        }
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: true
        }
    }]
}

const htmlPlugin = new HtmlWebpackPlugin({
	title: 'Output Management',
})

const cleanPlugin = new CleanWebpackPlugin()

module.exports = {
	mode: 'development',
  	entry: './src/index.js',
  	devtool: 'inline-source-map',
  	devServer: {
  		contentBase: './dist'
  	},
  	plugins: [
  		cleanPlugin,
  		htmlPlugin
  	],
  	output: {
    	filename: 'bundle.js',
    	path: path.resolve(__dirname, 'dist'),
  	},
  	module: {
  		rules: [
  			CSSRule
  		]
  	}
};