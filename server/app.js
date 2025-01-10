const express = require('express');
const { name } = require('../package.json');
const { ENV, getHost } = require('./config/env');
const setupStatic = require('./middleware/static');
const ssrRoutes = require('./routes/ssr');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = 8088;

// 禁用express生成的标识
app.disable('x-powered-by');

// 获取环境配置
const host = getHost(ENV);

// 初始化日志
console.log(`================start ssr node=================`);
console.log('当前node启用环境: ', ENV);

// 设置静态资源和代理
setupStatic(app, { name, host });

// SSR路由
app.use('/', ssrRoutes);

// 全局错误处理中间件 (必须放在所有路由之后)
app.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

// 启动服务
app.listen(port, () => {
    console.log('Listening on port %d', port);
    console.log('api host: ', host);
}); 