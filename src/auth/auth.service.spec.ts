import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CryptoDataService } from '../crypto-data/crypto-data.service';
import { Portfolio } from '../entity/portfolio.entity';
import { User } from '../entity/user.entity';


describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PortfolioService,
        CryptoDataService,
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
