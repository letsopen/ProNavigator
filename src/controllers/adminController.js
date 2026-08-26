const { body } = require('express-validator');
const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/response');

const loginRules = [
  body('username').trim().notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空'),
];

const changePasswordRules = [
  body('oldPassword').notEmpty().withMessage('旧密码不能为空'),
  body('newPassword').notEmpty().withMessage('新密码不能为空').isLength({ min: 6 }).withMessage('新密码长度不能少于 6 位'),
];

function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = adminService.login(username, password);

    sendSuccess(res, result, '登录成功');
  } catch (err) {
    next(err);
  }
}

function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    adminService.changePassword(req.user.username, oldPassword, newPassword);
    sendSuccess(res, null, '密码修改成功');
  } catch (err) {
    next(err);
  }
}

function logout(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      adminService.logout(token);
    }

    sendSuccess(res, null, '登出成功');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginRules,
  changePasswordRules,
  login,
  changePassword,
  logout,
};
