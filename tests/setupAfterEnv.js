const { initDb, closeDb, getDb } = require('../src/models/db');

beforeEach(() => {
  // 清理数据表，确保每个测试文件都在干净状态下运行
  closeDb();
  initDb();
  const db = getDb();
  db.prepare('DELETE FROM audit_log').run();
  db.prepare('DELETE FROM website').run();
  db.prepare('DELETE FROM category').run();
  db.prepare('DELETE FROM admin').run();

  // 重新插入默认管理员
  db.prepare(
    'INSERT INTO admin (username, password_hash) VALUES (\'admin\', \'$2a$10$yMRtYrofcop6Zl8J9tqZLeRu..JQSY3Qv7xDmXkq5WP6l0hmR2ba6\')'
  ).run();
});

afterAll(() => {
  closeDb();
});
