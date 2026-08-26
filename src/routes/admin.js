const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const upload = require('../middleware/upload');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const websiteController = require('../controllers/websiteController');
const sortController = require('../controllers/sortController');
const auditLogController = require('../controllers/auditLogController');

const router = express.Router();

router.post('/login', adminController.loginRules, validate, adminController.login);
router.put('/password', authenticateToken, adminController.changePasswordRules, validate, adminController.changePassword);
router.post('/logout', authenticateToken, adminController.logout);

router.get('/categories', authenticateToken, categoryController.listCategories);
router.post('/categories', authenticateToken, categoryController.createRules, validate, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, categoryController.updateRules, validate, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, categoryController.deleteRules, validate, categoryController.deleteCategory);
router.put('/categories/order', authenticateToken, sortController.categorySortRules, validate, sortController.sortCategories);

router.get('/websites', authenticateToken, websiteController.listRules, validate, websiteController.listWebsites);
router.post('/websites', authenticateToken, upload.single('logo'), websiteController.createRules, validate, websiteController.createWebsite);
router.get('/websites/:id', authenticateToken, websiteController.getWebsite);
router.put('/websites/:id', authenticateToken, upload.single('logo'), websiteController.updateRules, validate, websiteController.updateWebsite);
router.delete('/websites/:id', authenticateToken, websiteController.deleteWebsite);
router.put('/categories/:categoryId/websites/order', authenticateToken, sortController.websiteSortRules, validate, sortController.sortWebsites);
router.get('/audit-logs', authenticateToken, auditLogController.listRules, validate, auditLogController.listLogs);

module.exports = router;
