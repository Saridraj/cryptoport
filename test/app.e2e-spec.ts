import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';
import { AuthModule } from './../src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PortfolioModule } from './../src/portfolio/portfolio.module';

describe('E2E test', () => {
  let app: INestApplication;
  let authToken: string;
  async function mockAuthentication(): Promise<string> {
    // Generate a JWT token using your application's authentication logic
    const token = jwt.sign(
      { id: '221378cc-b519-48ee-af75-331856dfba35' },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );
    return token;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    authToken = await mockAuthentication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST: auth/register', () => {
    it('should return OK', async () => {
      await request(app.getHttpServer()).post('/auth/register').expect(201);
    });
  });

  describe('POST: auth/logIn', () => {
    it('should return OK', async () => {
      await request(app.getHttpServer()).post('/auth/logIn').expect(201);
    });
  });

  describe('GET: portfolio', () => {
    it('should return OK', async () => {
      const userId = '221378cc-b519-48ee-af75-331856dfba35';
      const config = {
        headers: {},
      };
      await request(app.getHttpServer())
        .get(`/portfolio/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
