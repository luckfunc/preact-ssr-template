const { merge } = require('webpack-merge');
const commonConfig = require('./webpack-common.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const systemEnv = process.env.NODE_ENV;
const apiDomains = require('./api-domain.json');
const webpack = require('webpack');
const { name, version } = require('./package.json');

const MainConfig = {
    // 生产环境
    mode: 'production',

    output: {
        path: path.resolve(__dirname, `./${name}`),
        // filename: '[name]_[contenthash].js',
	    filename: `${version}/[name].entry.js`,
        publicPath: `/${name}/`
    },

    // 代码优化配置
    optimization: {
        minimizer: [
            // 压缩js
            new TerserWebpackPlugin({
                // cache: true,
                parallel: true,
                terserOptions: {
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            }),

            // 压缩css
            new CssMinimizerPlugin({
                include: /\.css$/g,
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true }
                        }
                    ]
                }
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),

	    // 将文件复制到构建目录
	    // CopyWebpackPlugin-> https://github.com/webpack-contrib/copy-webpack-plugin
	    new CopyWebpackPlugin({
		    patterns: [
			    {from: path.join(__dirname, '/ads.txt'), to: './'}
		    ]
	    }),
        new webpack.DefinePlugin({
            'process.env': {
                API_DOMAIN: JSON.stringify(apiDomains[systemEnv]),
                NODE_ENV: JSON.stringify(systemEnv)
            }
        })
    ]
};

module.exports = merge(MainConfig, commonConfig(true));
