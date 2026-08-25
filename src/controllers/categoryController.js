const { body, param } = require('express-validator');
const categoryService = require('../services/categoryService');
const auditLogService = require('../services/auditLogService');
const { sendSuccess, AppError } = require('../utils/response');

const createRules = [
  body('categoryName')
    .trim()
    .notEmpty().withMessage('分类名称不能为空')
    .isLength({ max: 50 }).withMessage('分类名称长度不能超过 50 个字符'),
];

const updateRules = [
  param('id').isInt().withMessage('分类 ID 必须为整数'),
  body('categoryName')
    .trim()
    .notEmpty().withMessage('分类名称不能为空')
    .isLength({ max: 50 }).withMessage('分类名称长度不能超过 50 个字符'),
];

const deleteRules = [
  param('id').isInt().withMessage('分类 ID 必须为整数'),
];

function createCategory(req, res, next) {
  try {
    const { categoryName } = req.body;
    const existing = categoryService.getCategoryByName(categoryName);
    if (existing) {
      throw new AppError('分类名称已存在', 2002, 409);
    }

    const category = categoryService.createCategory(categoryName);
    auditLogService.log({
      action: 'CREATE_CATEGORY',
      targetType: 'CATEGORY',
      targetId: category.id,
      operator: req.user.username,
    });
    sendSuccess(res, category, '分类创建成功', 201);
  } catch (err) {
    next(err);
  }
}

function updateCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { categoryName } = req.body;
    const existing = categoryService.getCategoryByName(categoryName);
    if (existing && existing.id !== id) {
      throw new AppError('分类名称已存在', 2002, 409);
    }

    const category = categoryService.updateCategory(id, categoryName);
    auditLogService.log({
      action: 'UPDATE_CATEGORY',
      targetType: 'CATEGORY',
      targetId: category.id,
      operator: req.user.username,
    });
    sendSuccess(res, category, '分类更新成功');
  } catch (err) {
    next(err);
  }
}

function deleteCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    categoryService.deleteCategory(id);
    auditLogService.log({
      action: 'DELETE_CATEGORY',
      targetType: 'CATEGORY',
      targetId: id,
      operator: req.user.username,
    });
    sendSuccess(res, null, '分类删除成功');
  } catch (err) {
    next(err);
  }
}

function listCategories(req, res, next) {
  try {
    const categories = categoryService.listCategories();
    sendSuccess(res, categories);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRules,
  updateRules,
  deleteRules,
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
};
