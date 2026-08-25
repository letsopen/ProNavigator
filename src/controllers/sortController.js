const { body } = require('express-validator');
const categoryService = require('../services/categoryService');
const websiteService = require('../services/websiteService');
const auditLogService = require('../services/auditLogService');
const { sendSuccess, AppError } = require('../utils/response');

const categorySortRules = [
  body('ids').isArray({ min: 1 }).withMessage('排序 ID 数组不能为空'),
  body('ids.*').isInt().withMessage('所有 ID 必须为整数'),
];

const websiteSortRules = [
  body('ids').isArray({ min: 1 }).withMessage('排序 ID 数组不能为空'),
  body('ids.*').isInt().withMessage('所有 ID 必须为整数'),
];

function sortCategories(req, res, next) {
  try {
    const { ids } = req.body;
    const parsedIds = ids.map(id => parseInt(id, 10));

    const existingCategories = categoryService.listCategories();
    const existingIds = new Set(existingCategories.map(c => c.id));
    const allExist = parsedIds.every(id => existingIds.has(id));
    if (!allExist || parsedIds.length !== existingCategories.length) {
      throw new AppError('排序数据不完整', 4003, 400);
    }

    categoryService.reorderCategories(parsedIds);
    auditLogService.log({
      action: 'SORT_CATEGORIES',
      targetType: 'CATEGORY',
      operator: req.user.username,
    });
    sendSuccess(res, null, '分类排序已保存');
  } catch (err) {
    next(err);
  }
}

function sortWebsites(req, res, next) {
  try {
    const categoryId = parseInt(req.params.categoryId, 10);
    const { ids } = req.body;
    const parsedIds = ids.map(id => parseInt(id, 10));

    if (!categoryService.categoryExists(categoryId)) {
      throw new AppError('所属分类不存在', 3004, 400);
    }

    websiteService.reorderWebsites(categoryId, parsedIds);
    auditLogService.log({
      action: 'SORT_WEBSITES',
      targetType: 'CATEGORY',
      targetId: categoryId,
      operator: req.user.username,
    });
    sendSuccess(res, null, '网站排序已保存');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  categorySortRules,
  websiteSortRules,
  sortCategories,
  sortWebsites,
};
