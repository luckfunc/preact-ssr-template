const path = require('path');
const webpack = require('webpack');
const argv = require('yargs').argv;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { version, name } = require('./package.json');
const resolve = dir => path.resolve(__dirname, dir);
const serverPath = path.join(__dirname, 'server', 'page');
const entryOrigin = argv.env && argv.env.entryorigin || '';

console.log(`build ssr node, entryOrigin=[${entryOrigin}]`);
module.exports = {
	name: 'ssr node',
	mode: 'production',
	entry: {
		index: './src/page/index/ssr.tsx'
	},
	target: 'node',
	output: {
		path: serverPath,
		publicPath: `/${name}/`,
		filename: `${version}/[name].ssr.js`,
		library: 'page',
		libraryTarget: 'commonjs'
	},
	resolve: {
		alias: {
			'@components': resolve('src/components'),
			'@common': resolve('src/common'),
			'@constants': resolve('src/constants'),
			'@http': resolve('src/common/http'),
			'@assets': resolve('src/assets'),
			'@utils': resolve('src/utils'),
			'@stores': resolve('./src/stores'),
			'react': 'preact/compat',
			'react-dom': 'preact/compat',
			'react/jsx-runtime': 'preact/jsx-runtime'
		},
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	externals: {
		'preact': 'commonjs preact',
		'preact/compat': 'commonjs preact/compat',
		'preact-render-to-string': 'commonjs preact-render-to-string',
		'preact/jsx-runtime': 'commonjs preact/jsx-runtime'
	},
	module: {
		rules: [
			{ test: /\.js/, use: ['babel-loader?cacheDirectory=true'] },

			{
				test: /\.jsx?$/,
				// thread-loader：放置在这个 loader 之后的 loader 就会在一个单独的 worker 池中运行
				use: ['babel-loader?cacheDirectory=true'],
				// 不使用cache-loader的时候，可以在babel-loader的options中设置cacheDirectory: true
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules/
			},
			{
				test: /\.tsx?$/,
				include: [path.resolve(__dirname, 'src')],
				use: ['babel-loader?cacheDirectory=true'],
				exclude: /node_modules/
			},
			{
				test: /\.(le|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: { esModule: true }
					},
					{
						loader: 'css-loader',
						options: {
							modules: false,
							importLoaders: 1,
							url: true, // 启用/禁用 url() 处理
							sourceMap: false // 启用/禁用 Sourcemaps
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								// 使用插件
								plugins: [
									'postcss-import', // 支持@import 引入css
									'autoprefixer', // CSS浏览器兼容
									'cssnano' // 压缩css
								]
							}
						}
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: true // 启用/禁用 Sourcemaps
						}
					}
				],
				include: path.resolve(__dirname, './src')
			},
			{
				// 图片、字体等处理
				test: /\.(png|jpg|jpeg|gif|webp|svg|eot|ttf|woff|woff2|csv|docx)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1024,
							esModule: false, // 文件加载器生成使用ES模块语法的JS模块
							name: '[name].[ext]', // 打包出的文件名称
							outputPath: `${version}/assets` // 文件过大时输出到名称为assets的文件夹中
						}
					}
				]
			},

			{
				test: /\.tpl\.html$/,
				use: [
					{
						loader: 'html-loader'
					}
				],
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				ENTRY_ORIGIN: JSON.stringify(entryOrigin),
				API_DOMAIN: JSON.stringify(''),
				NODE_ENV: JSON.stringify('production'),
				VERSION: JSON.stringify(version),
				BUILD_NAME: JSON.stringify(name)
			}
		}),
		// 添加 Preact 的全局变量定义
		new webpack.ProvidePlugin({
			h: ['preact', 'h'],
			Fragment: ['preact', 'Fragment']
		}),
		new MiniCssExtractPlugin({
			filename: `${version}/[name].ssr.css`,
			chunkFilename: '[id].css'
		})
	]
}
