const { getDb } = require('../models/db');
const config = require('../config');

function formatWithTimezone(value, timezone) {
  if (!value) return value;
  const iso = `${value}`.trim();
  const date = iso.endsWith('Z') ? new Date(iso) : new Date(`${iso}Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function log({ action, targetType, targetId, operator }) {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO audit_log (action, target_type, target_id, operator) VALUES (?, ?, ?, ?)'
  );
  stmt.run(action, targetType, targetId || null, operator);
}

function listLogs({ page = 1, size = 20 }) {
  const db = getDb();
  const rows = db.prepare(
    'SELECT * FROM audit_log ORDER BY create_time DESC LIMIT ? OFFSET ?'
  ).all(size, (page - 1) * size);
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM audit_log').get();

  return {
    list: rows.map(row => ({
      id: row.id,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      operator: row.operator,
      createTime: formatWithTimezone(row.create_time, config.timezone),
    })),
    total,
    page,
    size,
  };
}

module.exports = {
  log,
  listLogs,
};
