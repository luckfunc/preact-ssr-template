const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const { ENV, isDev } = require('../config/env');
const { API_PREFIX } = require('../config/constants');

const setupStatic = (app, { name, host }) => {
    // 开发环境代理设置
    if (isDev) {
        app.use(proxy(API_PREFIX, { target: host }));
        app.use(proxy(`/${name}/`, { target: 'http://127.0.0.1:2028' }));
    }

    // 静态资源
    app.use(express.static(path.join(__dirname, '../..')));
    app.use(express.static(path.join(__dirname, `../../${name}/`)));
};

module.exports = setupStatic; 