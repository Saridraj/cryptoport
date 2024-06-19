import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { Portfolio } from '../entity/portfolio.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { HttpService } from '@nestjs/axios';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PortfolioService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock repository class
        },
        {
          provide: getRepositoryToken(Portfolio),
          useClass: Repository, // Mock repository class
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
