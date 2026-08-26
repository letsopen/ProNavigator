const express = require('express');

const router = express.Router();

router.get('/admin/login', (req, res) => {
  res.render('admin/login', { title: '管理员登录' });
});

router.get('/admin/categories', (req, res) => {
  res.render('admin/categories', { title: '分类管理', active: 'categories' });
});

router.get('/admin/websites', (req, res) => {
  res.render('admin/websites', { title: '网站管理', active: 'websites' });
});

router.get('/admin/password', (req, res) => {
  res.render('admin/password', { title: '修改密码', active: 'password' });
});

module.exports = router;
