const websiteService = require('../services/websiteService');
const { sendSuccess, AppError } = require('../utils/response');
const { renderMarkdown } = require('../utils/markdown');

function homeData(req, res, next) {
  try {
    const categories = websiteService.getHomeData();
    sendSuccess(res, { categories, empty: categories.length === 0 });
  } catch (err) {
    next(err);
  }
}

function publicDetail(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const website = websiteService.getWebsiteById(id);
    if (!website) {
      throw new AppError('网站不存在', 3005, 404);
    }

    sendSuccess(res, {
      ...website,
      descriptionHtml: renderMarkdown(website.description),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  homeData,
  publicDetail,
};
