const { AppError } = require('../utils/response');
const logger = require('../utils/logger');

function notFoundHandler(req, res, _next) {
  res.status(404).json({
    code: 4040,
    message: '请求的资源不存在',
    data: null,
  });
}

function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      data: null,
    });
  }

  if (err.name === 'SyntaxError' && err.status === 400) {
    return res.status(400).json({
      code: 4000,
      message: '请求体格式不正确',
      data: null,
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      code: 3006,
      message: '文件大小超过限制',
      data: null,
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      code: 3003,
      message: 'Logo 必须为图片文件',
      data: null,
    });
  }

  logger.error('Unhandled error: %s', err.stack || err.message);
  res.status(500).json({
    code: 5000,
    message: '服务器内部错误',
    data: null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
