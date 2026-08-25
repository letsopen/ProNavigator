const { body, param, query } = require('express-validator');
const websiteService = require('../services/websiteService');
const categoryService = require('../services/categoryService');
const auditLogService = require('../services/auditLogService');
const { sendSuccess, AppError } = require('../utils/response');
const { isValidUrl } = require('../utils/validators');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const createRules = [
  body('websiteName').trim().notEmpty().withMessage('网站名称不能为空').isLength({ max: 100 }).withMessage('网站名称长度不能超过 100 个字符'),
  body('url').trim().notEmpty().withMessage('URL 不能为空'),
  body('categoryId').notEmpty().withMessage('所属分类不能为空').isInt().withMessage('所属分类 ID 必须为整数'),
];

const updateRules = [
  param('id').isInt().withMessage('网站 ID 必须为整数'),
  body('websiteName').trim().notEmpty().withMessage('网站名称不能为空').isLength({ max: 100 }).withMessage('网站名称长度不能超过 100 个字符'),
  body('url').trim().notEmpty().withMessage('URL 不能为空'),
  body('categoryId').notEmpty().withMessage('所属分类不能为空').isInt().withMessage('所属分类 ID 必须为整数'),
];

const listRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page 必须为正整数'),
  query('size').optional().isInt({ min: 1 }).withMessage('size 必须为正整数'),
];

function parseWebsiteBody(req) {
  const { websiteName, url, categoryId, description } = req.body;
  const categoryIdInt = parseInt(categoryId, 10);

  if (!isValidUrl(url)) {
    throw new AppError('URL 格式不合法', 3002, 400);
  }

  if (!categoryService.categoryExists(categoryIdInt)) {
    throw new AppError('所属分类不存在', 3004, 400);
  }

  return {
    websiteName,
    url,
    categoryId: categoryIdInt,
    description: description || null,
  };
}

function createWebsite(req, res, next) {
  try {
    const data = parseWebsiteBody(req);
    const logo = req.file ? `/uploads/${req.file.filename}` : null;
    const website = websiteService.createWebsite({ ...data, logo });

    auditLogService.log({
      action: 'CREATE_WEBSITE',
      targetType: 'WEBSITE',
      targetId: website.id,
      operator: req.user.username,
    });

    sendSuccess(res, website, '网站创建成功', 201);
  } catch (err) {
    if (req.file) {
      fs.unlink(path.join(config.uploadDir, req.file.filename), () => {});
    }
    next(err);
  }
}

function updateWebsite(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const data = parseWebsiteBody(req);

    let logo;
    let removeLogo = false;
    if (req.body.removeLogo === 'true' || req.body.removeLogo === true) {
      removeLogo = true;
    }

    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
      const existing = websiteService.getWebsiteById(id);
      if (existing && existing.logo && !existing.logo.startsWith('http')) {
        const oldPath = path.join(config.uploadDir, path.basename(existing.logo));
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, () => {});
        }
      }
    }

    const website = websiteService.updateWebsite(id, { ...data, logo, removeLogo });

    auditLogService.log({
      action: 'UPDATE_WEBSITE',
      targetType: 'WEBSITE',
      targetId: website.id,
      operator: req.user.username,
    });

    sendSuccess(res, website, '网站更新成功');
  } catch (err) {
    if (req.file) {
      fs.unlink(path.join(config.uploadDir, req.file.filename), () => {});
    }
    next(err);
  }
}

function deleteWebsite(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const website = websiteService.getWebsiteById(id);
    if (website && website.logo) {
      const logoPath = path.join(config.uploadDir, path.basename(website.logo));
      if (fs.existsSync(logoPath)) {
        fs.unlink(logoPath, () => {});
      }
    }

    websiteService.deleteWebsite(id);
    auditLogService.log({
      action: 'DELETE_WEBSITE',
      targetType: 'WEBSITE',
      targetId: id,
      operator: req.user.username,
    });
    sendSuccess(res, null, '网站删除成功');
  } catch (err) {
    next(err);
  }
}

function getWebsite(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const website = websiteService.getWebsiteById(id);
    if (!website) {
      throw new AppError('网站不存在', 3005, 404);
    }
    sendSuccess(res, website);
  } catch (err) {
    next(err);
  }
}

function listWebsites(req, res, next) {
  try {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId, 10) : null;
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 20;
    const result = websiteService.listWebsites({ categoryId, page, size });
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRules,
  updateRules,
  listRules,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  getWebsite,
  listWebsites,
};
