const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const config = require('./config');
const { initDb } = require('./models/db');
const logger = require('./utils/logger');
const { notFoundHandler, errorHandler } = require('./middleware/error');
const { AppError } = require('./utils/response');

const app = express();

// 初始化数据库
initDb();

// 静态资源
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'public', 'dist')));

// 请求日志
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));


// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/admin', require('./routes/admin'));
app.use('/api/public', require('./routes/public'));

// API 404 处理
app.use('/api', (req, res, next) => {
  next(new AppError('接口不存在', 4004, 404));
});

// 前端 history fallback
app.get('*', (req, res, next) => {
  const indexPath = path.join(__dirname, '..', 'public', 'dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    return next(new AppError('前端构建产物不存在，请先执行 npm run build:web', 5001, 503));
  }
  res.sendFile(indexPath);
});

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    logger.info('Company navigation server is running on port %d', config.port);
  });
}

module.exports = app;
