function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidImageMime(mimeType) {
  return mimeType && mimeType.startsWith('image/');
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

module.exports = {
  isValidUrl,
  isValidImageMime,
  sanitizeFilename,
};
