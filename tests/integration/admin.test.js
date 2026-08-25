const request = require('supertest');
const app = require('../../src/app');

describe('Admin API', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.data.token;
  });

  it('should login with default credentials', () => {
    expect(token).toBeDefined();
  });

  it('should create and list category', async () => {
    const createRes = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ categoryName: '测试分类' });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.categoryName).toBe('测试分类');

    const listRes = await request(app)
      .get('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should reject duplicate category name', async () => {
    await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ categoryName: '测试分类' });

    const res = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ categoryName: '测试分类' });
    expect(res.status).toBe(409);
  });

  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/admin/categories');
    expect(res.status).toBe(401);
  });
});
