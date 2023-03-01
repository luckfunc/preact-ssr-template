const express = require('express');
const { version, name } = require('../package.json');
const proxy = require('http-proxy-middleware');
const axios = require('axios');
const path = require('path');
const React = require('react');
const { API_PREFIX } = require('./constants');

const app = express();
// 禁用express生成的标识
app.disable('x-powered-by');

const homeSSR = require(`./page/${version}/index.ssr.js`).page.default;

const port = 8088;

// 接口地址: 提供给node端使用，仅在产品环境下与apiDomain不同 用于解决阿里云中不能解析同环境下的域名
let host;

// 非本地环境中使用时需要在node中增加变量，本地访问线上接口时通过webpack-dev.config.js
const ENV = process.env.ENV;

// 缓存时长(用于向cloud flare传递)
console.log(`================start ssr node=================`);
console.log('当前node启用环境: ', ENV);
if (ENV === 'test') { // ENV 在gears中配置
	// 测试环境
	host = 'http://test.api.com'; // qa api
} else if (ENV === 'prod') { // ENV 在gears中配置
	// 产品环境
	host = 'http://www.api.com'; // qa api
} else if (ENV === 'development'){ // ENV 在package.json中配置
	// 本地 调用mock接口
	host = 'http://127.0.0.1:8080';
} else if (ENV === 'qa'){ // ENV 在package.json中配置
	// 本地 调用qa接口
	host = 'http://test.api.com'; // qa api
	siteId = 'site_4';
} else if (ENV === 'pro'){ // ENV 在package.json中配置
	// 本地 调用pro接口
	host = 'http://www.api.com'; // qa api
}

app.use(proxy(API_PREFIX, { target: host }));

// home page
app.get(['/', '/index.html', '/home.html'], function(req, res) {
	console.log(111111);
	res.end(homeSSR({}));
});

// 获取其它的静态资源: 访问路径为/xxxx/xx.xx，线上环境通过Gears配置后，这项不会用到
app.use(express.static(path.join(__dirname, '..')));

// 获取其它的静态资源: 访问路径为/xx.xx，比如/ads.txt会通过这里
app.use(express.static(path.join(__dirname, `../${name}/`)));
app.listen(port, function() {
	console.log('Listening on port %d', port);
	console.log('api host: ', host);
});
