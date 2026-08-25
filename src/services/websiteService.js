const { getDb } = require('../models/db');
const { AppError } = require('../utils/response');


function rowToCategory(row) {
  return {
    id: row.id,
    categoryName: row.category_name,
    displayOrder: row.display_order,
    createTime: row.create_time,
    updateTime: row.update_time,
  };
}

function rowToWebsite(row) {
  return {
    id: row.id,
    websiteName: row.website_name,
    url: row.url,
    logo: row.logo,
    description: row.description,
    categoryId: row.category_id,
    displayOrder: row.display_order,
    createTime: row.create_time,
    updateTime: row.update_time,
  };
}

function getMaxDisplayOrder(db, categoryId) {
  const result = db.prepare('SELECT COALESCE(MAX(display_order), 0) AS max_order FROM website WHERE category_id = ?').get(categoryId);
  return result.max_order;
}

function createWebsite({ websiteName, url, categoryId, description, logo }) {
  const db = getDb();
  const maxOrder = getMaxDisplayOrder(db, categoryId);
  const stmt = db.prepare(
    'INSERT INTO website (website_name, url, logo, description, category_id, display_order) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(websiteName.trim(), url.trim(), logo || null, description || null, categoryId, maxOrder + 1);
  return getWebsiteById(result.lastInsertRowid);
}

function updateWebsite(id, { websiteName, url, categoryId, description, logo, removeLogo }) {
  const db = getDb();
  const existing = getWebsiteById(id);
  if (!existing) {
    throw new AppError('网站不存在', 3005, 404);
  }

  let displayOrder = existing.displayOrder;
  let newLogo = existing.logo;

  if (categoryId !== existing.categoryId) {
    displayOrder = getMaxDisplayOrder(db, categoryId) + 1;
  }

  if (removeLogo) {
    newLogo = null;
  } else if (logo !== undefined) {
    newLogo = logo;
  }

  const stmt = db.prepare(
    'UPDATE website SET website_name = ?, url = ?, logo = ?, description = ?, category_id = ?, display_order = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?'
  );
  stmt.run(websiteName.trim(), url.trim(), newLogo, description || null, categoryId, displayOrder, id);
  return getWebsiteById(id);
}

function deleteWebsite(id) {
  const db = getDb();
  const result = db.prepare('DELETE FROM website WHERE id = ?').run(id);
  if (result.changes === 0) {
    throw new AppError('网站不存在', 3005, 404);
  }
  return true;
}

function getWebsiteById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM website WHERE id = ?').get(id);
  if (!row) return null;
  return rowToWebsite(row);
}

function getWebsitesByCategory(categoryId) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM website WHERE category_id = ? ORDER BY display_order ASC, id ASC').all(categoryId);
  return rows.map(rowToWebsite);
}

function listWebsites({ categoryId, page = 1, size = 20 }) {
  const db = getDb();
  let sql = 'SELECT * FROM website WHERE 1=1';
  const params = [];
  if (categoryId) {
    sql += ' AND category_id = ?';
    params.push(categoryId);
  }
  sql += ' ORDER BY category_id ASC, display_order ASC, id ASC LIMIT ? OFFSET ?';
  params.push(size, (page - 1) * size);
  const rows = db.prepare(sql).all(...params);

  let countSql = 'SELECT COUNT(*) AS total FROM website WHERE 1=1';
  const countParams = [];
  if (categoryId) {
    countSql += ' AND category_id = ?';
    countParams.push(categoryId);
  }
  const { total } = db.prepare(countSql).get(...countParams);

  return {
    list: rows.map(rowToWebsite),
    total,
    page,
    size,
  };
}

function reorderWebsites(categoryId, ids) {
  const db = getDb();
  const transaction = db.transaction((categoryId, ids) => {
    const updateStmt = db.prepare('UPDATE website SET display_order = ? WHERE id = ? AND category_id = ?');
    ids.forEach((id, index) => {
      const result = updateStmt.run(index + 1, id, categoryId);
      if (result.changes === 0) {
        throw new AppError('排序操作不能改变网站所属分类', 4002, 400);
      }
    });
  });
  transaction(categoryId, ids);
  return true;
}

function getHomeData() {
  const db = getDb();
  const categories = db.prepare('SELECT * FROM category ORDER BY display_order ASC, id ASC').all();
  const result = [];
  for (const category of categories) {
    const websites = db.prepare(
      'SELECT * FROM website WHERE category_id = ? ORDER BY display_order ASC, id ASC'
    ).all(category.id);
    result.push({
      ...rowToCategory(category),
      websites: websites.map(rowToWebsite),
    });
  }
  return result;
}

module.exports = {
  createWebsite,
  updateWebsite,
  deleteWebsite,
  getWebsiteById,
  getWebsitesByCategory,
  listWebsites,
  reorderWebsites,
  getHomeData,
};
