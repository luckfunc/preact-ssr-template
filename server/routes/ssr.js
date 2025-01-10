const express = require('express');
const axios = require('axios');
const { renderHome, renderGame } = require('../services/render');

const router = express.Router();

router.get(['/', '/index.html', '/home.html'], async (req, res, next) => {
  try {
    const html = renderHome({});
    res.end(html);
  } catch (error) {
    // 传递错误给全局错误处理中间件
    next(error);
  }
});

// game路由
router.get(['/game', '/game.html'], (req, res, next) => {
  try {
    const html = renderGame({});
    res.end(html);
  } catch (error) {
    // 传递错误给全局错误处理中间件
    next(error);
  }
});

module.exports = router; 