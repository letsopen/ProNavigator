const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const categoryService = require('../services/categoryService');
const websiteService = require('../services/websiteService');

const router = express.Router();

router.get('/admin/login', (req, res) => {
  res.render('admin/login', { title: '管理员登录' });
});

router.get('/admin/categories', authenticateToken, (req, res) => {
  const categories = categoryService.listCategories();
  res.render('admin/categories', { title: '分类管理', active: 'categories', categories });
});

router.get('/admin/websites', authenticateToken, (req, res) => {
  const categories = categoryService.listCategories();
  const websitesResult = websiteService.listWebsites({ page: 1, size: 1000 });
  res.render('admin/websites', { title: '网站管理', active: 'websites', categories, websites: websitesResult.list });
});

router.get('/admin/password', authenticateToken, (req, res) => {
  res.render('admin/password', { title: '修改密码', active: 'password' });
});

module.exports = router;
