const chalk = require('chalk');

const errorHandler = (err, req, res, next) => {
    console.log(chalk.blue('hostname:'), req.hostname);
    
    // 打印路由信息
    console.log(chalk.red('==========Error Stack=========='));
    console.log(chalk.red('Route:'), `${req.method} ${req.hostname + req.originalUrl}`);
    console.log(chalk.red('User Agent:'), req.get('user-agent'));
    console.log(chalk.red('Request Query:'), req.query);
    console.log(chalk.red('Request Body:'), req.body);
    
    // 区分不同类型的错误
    if (err.response) {
        // API 请求错误
        console.error(chalk.red('API Error:'), {
            status: err.response.status,
            data: err.response.data,
            url: err.config?.url
        });
    } else if (err.code === 'RENDER_ERROR') {
        // SSR渲染错误
        console.error(chalk.red('Render Error:'), err.message);
    } else {
        // 其他错误
        console.error(chalk.red('Error:'), err.message);
        console.error(chalk.red('Stack:'), err.stack);
    }
    console.log(chalk.red('============================'));

    // 设置状态码
    res.status(err.status || 500);

    // 返回错误响应
    res.send({
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorHandler; 