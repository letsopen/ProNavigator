const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../models/db');
const { AppError } = require('../utils/response');
const config = require('../config');

const tokenBlacklist = new Set();

function rowToAdmin(row) {
  return {
    id: row.id,
    username: row.username,
    updateTime: row.update_time,
  };
}

function getAdminByUsername(username) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
  if (!row) return null;
  return rowToAdmin(row);
}

function getAdminWithPassword(username) {
  const db = getDb();
  return db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function login(username, password) {
  const row = getAdminWithPassword(username);
  if (!row) {
    throw new AppError('用户名或密码错误', 1002, 401);
  }

  if (!password) {
    throw new AppError('密码不能为空', 1001, 400);
  }

  if (!verifyPassword(password, row.password_hash)) {
    throw new AppError('用户名或密码错误', 1002, 401);
  }

  const token = jwt.sign(
    { id: row.id, username: row.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    admin: rowToAdmin(row),
  };
}

function changePassword(username, oldPassword, newPassword) {
  if (!newPassword) {
    throw new AppError('新密码不能为空', 1004, 400);
  }

  const row = getAdminWithPassword(username);
  if (!row) {
    throw new AppError('管理员不存在', 1007, 404);
  }

  if (!verifyPassword(oldPassword, row.password_hash)) {
    throw new AppError('旧密码错误', 1003, 400);
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  const db = getDb();
  db.prepare('UPDATE admin SET password_hash = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, row.id);

  return true;
}

function logout(token) {
  tokenBlacklist.add(token);
  return true;
}

function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

module.exports = {
  login,
  changePassword,
  logout,
  isTokenBlacklisted,
  getAdminByUsername,
  getAdminWithPassword,
  verifyPassword,
  tokenBlacklist,
};
