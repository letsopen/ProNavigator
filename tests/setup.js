const path = require('path');

module.exports = async () => {
  process.env.DB_PATH = path.join(__dirname, '..', 'data', 'nav.test.db');
};
