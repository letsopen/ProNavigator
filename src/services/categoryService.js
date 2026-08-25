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

function createCategory(categoryName) {
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(display_order), 0) AS max_order FROM category').get();
  const stmt = db.prepare('INSERT INTO category (category_name, display_order) VALUES (?, ?)');
  const result = stmt.run(categoryName.trim(), maxOrder.max_order + 1);
  return getCategoryById(result.lastInsertRowid);
}

function updateCategory(id, categoryName) {
  const db = getDb();
  const stmt = db.prepare('UPDATE category SET category_name = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?');
  const result = stmt.run(categoryName.trim(), id);
  if (result.changes === 0) {
    throw new AppError('分类不存在', 2004, 404);
  }
  return getCategoryById(id);
}

function deleteCategory(id) {
  const db = getDb();
  const websiteCount = db.prepare('SELECT COUNT(*) AS count FROM website WHERE category_id = ?').get(id);
  if (websiteCount.count > 0) {
    throw new AppError('分类下存在网站，无法删除', 2005, 400);
  }

  const result = db.prepare('DELETE FROM category WHERE id = ?').run(id);
  if (result.changes === 0) {
    throw new AppError('分类不存在', 2004, 404);
  }
  return true;
}

function getCategoryById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM category WHERE id = ?').get(id);
  if (!row) return null;
  return rowToCategory(row);
}

function getCategoryByName(categoryName) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM category WHERE LOWER(category_name) = LOWER(?)').get(categoryName.trim());
  if (!row) return null;
  return rowToCategory(row);
}

function listCategories() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM category ORDER BY display_order ASC, id ASC').all();
  return rows.map(rowToCategory);
}

function reorderCategories(ids) {
  const db = getDb();
  const transaction = db.transaction((ids) => {
    const updateStmt = db.prepare('UPDATE category SET display_order = ? WHERE id = ?');
    ids.forEach((id, index) => {
      updateStmt.run(index + 1, id);
    });
  });
  transaction(ids);
  return true;
}

function categoryExists(id) {
  const db = getDb();
  const row = db.prepare('SELECT id FROM category WHERE id = ?').get(id);
  return !!row;
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByName,
  listCategories,
  reorderCategories,
  categoryExists,
};
