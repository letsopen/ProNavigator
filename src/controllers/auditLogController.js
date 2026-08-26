const { query } = require('express-validator');
const auditLogService = require('../services/auditLogService');
const { sendSuccess } = require('../utils/response');

const listRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须为正整数'),
  query('size').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在 1-100 之间'),
];

function listLogs(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const size = parseInt(req.query.size || '20', 10);
    const result = auditLogService.listLogs({ page, size });
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listRules,
  listLogs,
};
