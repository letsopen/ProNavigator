function success(data = null, message = 'success') {
  return { code: 0, message, data };
}

function error(message = 'error', code = 5000, data = null) {
  return { code, message, data };
}

function sendSuccess(res, data, message, statusCode = 200) {
  return res.status(statusCode).json(success(data, message));
}

function sendError(res, message, code, statusCode = 400, data = null) {
  return res.status(statusCode).json(error(message, code, data));
}

class AppError extends Error {
  constructor(message, code = 5000, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

module.exports = {
  success,
  error,
  sendSuccess,
  sendError,
  AppError,
};
