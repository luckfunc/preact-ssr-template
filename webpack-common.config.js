const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { version } = require('./package.json');
const resolve = dir => path.resolve(__dirname, dir);

const getHtmlConf = module => {
    let filename = `${module}.html`;
    let template = `src/page/${module}/index.html`;
    return {
        filename,
        template,
	    favicon: './src/assets/images/favicon.ico',
        chunks:['vendor', module]
    };
};

module.exports = () => {
    return {
        module: {
            // 如果一些第三方模块没有AMD/CommonJS规范版本，可以使用 noParse 来标识这个模块，但是webpack不进行转化和解析
            rules: [
                {
                    test: /\.(jsx|js)?$/,
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

        entry: {
            index: './src/page/index/index.tsx'
        },
        resolve: {
            alias: {
                '@components': resolve('src/components'),
                '@common': resolve('src/common'),
                '@constants': resolve('src/constants'),
                '@http': resolve('src/common/http'),
                '@assets': resolve('src/assets'),
                '@utils': resolve('src/utils'),
                '@stores': resolve('./src/stores')
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },

	    externals: {
		    'axios': 'axios',
		    'react': 'React',
		    'react-dom': 'ReactDOM',
		    'classnames': 'classNames'
	    },

        plugins: [
            new HtmlWebpackPlugin(getHtmlConf('index')),

            // 抽离样式文件到单独目录
            new MiniCssExtractPlugin({
                filename: `${version}/[name].entry.css`,
                chunkFilename: '[id].css'
                // ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
            // 打包进度
            // new ProgressBarPlugin({
            //     format: 'progress: [:bar' + chalk.green.bold(':percent') + '] (:elapsed seconds) :msg',
            //     clear: false,
            //     width: 60
            // })
        ]
    };
};
