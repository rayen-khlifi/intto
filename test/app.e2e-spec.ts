import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('InterimAI (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interimai_test';
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access';
    process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register -> should register', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'jobseeker@test.com',
        password: 'Password123',
        role: 'JOB_SEEKER',
        displayName: 'Job Seeker',
      })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe('jobseeker@test.com');
  });

  it('POST /auth/login -> should login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'jobseeker@test.com',
        password: 'Password123',
      })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
  });

  it('GET /users/me -> protected route', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'jobseeker@test.com', password: 'Password123' });

    const token = login.body.accessToken;

    const res = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.email).toBe('jobseeker@test.com');
  });

  it('POST /jobs -> should be forbidden for job seeker', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'jobseeker@test.com', password: 'Password123' });

    const token = login.body.accessToken;

    await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', description: 'Test' })
      .expect(403);
  });
});
