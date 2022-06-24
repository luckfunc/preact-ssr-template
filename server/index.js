const express = require('express');
const { version, name } = require('../package.json');
const proxy = require('http-proxy-middleware');
const axios = require('axios');
const path = require('path');
const React = require('react');
const app = express();

const homeSSR = require(`./page/${version}/index.ssr.js`).page.default;

const port = 8088;
const API_PREFIX = '/api/v1'; // 接口前缀

// 接口地址
let host = 'http://127.0.0.1:8080'; // mock
// let host = 'http://test-service.gamebridge.com'; // qa api
// let host = 'http://service.gamebridge.com'; // pro api

const env = process.env.ENV;
if (env === 'test' || env === 'qa') {
	host = 'http://test.api.com'; // qa api
}
if (env === 'prod') {
	host = 'http://www.api.com'; // pro api
}
app.use(proxy(API_PREFIX, { target: host }));

// home page
app.get(['/', '/index.html', '/home.html'], function(req, res) {
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
