const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { isValidImageMime } = require('../utils/validators');

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `logo-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (isValidImageMime(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Logo 必须为图片文件'), false);
    }
  },
});

module.exports = upload;
