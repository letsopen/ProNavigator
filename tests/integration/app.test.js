const request = require('supertest');
const app = require('../../src/app');

describe('App', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET / should serve frontend index.html', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="app"></div>');
  });

  it('GET /admin/login should serve frontend index.html', async () => {
    const res = await request(app).get('/admin/login');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="app"></div>');
  });

  it('GET /api/unknown should return 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe(4004);
  });
});
