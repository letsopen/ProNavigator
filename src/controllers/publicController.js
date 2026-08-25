const websiteService = require('../services/websiteService');
const { sendSuccess, AppError } = require('../utils/response');
const { renderMarkdown } = require('../utils/markdown');

function home(req, res, next) {
  try {
    const categories = websiteService.getHomeData();
    const empty = categories.length === 0;
    res.render('public/home', {
      title: '公司内部导航站',
      categories,
      empty,
    });
  } catch (err) {
    next(err);
  }
}

function detail(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const website = websiteService.getWebsiteById(id);
    if (!website) {
      throw new AppError('网站不存在', 3005, 404);
    }

    res.render('public/detail', {
      title: website.websiteName,
      website: {
        ...website,
        descriptionHtml: renderMarkdown(website.description),
      },
    });
  } catch (err) {
    next(err);
  }
}

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
  home,
  detail,
  homeData,
  publicDetail,
};
