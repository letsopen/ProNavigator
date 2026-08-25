-- 管理员表
CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 网站表
CREATE TABLE IF NOT EXISTS website (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  website_name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  category_id INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT
);

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER,
  operator TEXT NOT NULL,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_category_name ON category(category_name);
CREATE INDEX IF NOT EXISTS idx_category_display_order ON category(display_order);
CREATE INDEX IF NOT EXISTS idx_website_category_display_order ON website(category_id, display_order);
CREATE INDEX IF NOT EXISTS idx_audit_log_create_time ON audit_log(create_time);

-- 插入默认管理员账号
-- 默认密码: admin123
INSERT OR IGNORE INTO admin (username, password_hash) VALUES (
  'admin',
  '$2a$10$yMRtYrofcop6Zl8J9tqZLeRu..JQSY3Qv7xDmXkq5WP6l0hmR2ba6'
);