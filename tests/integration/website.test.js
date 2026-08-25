const request = require('supertest');
const app = require('../../src/app');

describe('Website API', () => {
  let token;
  let categoryId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.data.token;

    const catRes = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ categoryName: '网站测试分类' });
    categoryId = catRes.body.data.id;
  });

  it('should create a website', async () => {
    const res = await request(app)
      .post('/api/admin/websites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        websiteName: '测试网站',
        url: 'https://example.com',
        categoryId,
        description: '# 说明\n测试说明',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.websiteName).toBe('测试网站');
  });

  it('should reject invalid URL', async () => {
    const res = await request(app)
      .post('/api/admin/websites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        websiteName: '测试网站2',
        url: 'not-a-valid-url',
        categoryId,
      });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe(3002);
  });

  it('should get public home data', async () => {
    await request(app)
      .post('/api/admin/websites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        websiteName: '测试网站',
        url: 'https://example.com',
        categoryId,
      });

    const res = await request(app).get('/api/public/home');
    expect(res.status).toBe(200);
    expect(res.body.data.categories.length).toBeGreaterThan(0);
  });
});
