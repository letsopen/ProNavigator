const request = require('supertest');
const app = require('../../src/app');

describe('Auth Cookie', () => {
  it('should access admin page after login with cookie', async () => {
    const agent = request.agent(app);

    const loginRes = await agent
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.headers['set-cookie']).toBeDefined();

    const pageRes = await agent.get('/admin/categories');
    expect(pageRes.status).toBe(200);
    expect(pageRes.text).toContain('分类管理');
  });

  it('should reject admin page without cookie', async () => {
    const res = await request(app).get('/admin/categories');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe(1005);
  });
});
