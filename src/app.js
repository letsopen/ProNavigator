const express = require('express');
const path = require('path');
const morgan = require('morgan');

const engine = require('ejs-mate');
const config = require('./config');
const { initDb } = require('./models/db');
const logger = require('./utils/logger');
const { notFoundHandler, errorHandler } = require('./middleware/error');

const app = express();

// 初始化数据库
initDb();

// 视图引擎
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// 静态资源
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use('/css', express.static(path.join(__dirname, '..', 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));

// 请求日志
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));


// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 路由
app.use('/api/admin', require('./routes/admin'));
app.use('/api/public', require('./routes/public'));
app.use('/', require('./routes/pages'));
app.use('/', require('./routes/adminPages'));

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    logger.info('Company navigation server is running on port %d', config.port);
  });
}

module.exports = app;
