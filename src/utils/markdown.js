const { marked } = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const allowedTags = [
  'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'sup', 'sub'
];

const allowedAttrs = ['href', 'title', 'src', 'alt', 'target', 'class'];

function renderMarkdown(markdownText) {
  if (!markdownText) return '';
  const rawHtml = marked.parse(markdownText, { async: false });
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs,
  });
}

module.exports = {
  renderMarkdown,
};
