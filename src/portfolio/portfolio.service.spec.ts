import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entity/portfolio.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';


describe('PortfolioService', () => {
  let portfolioRepository: Repository<Portfolio>;
  let portfolioService: PortfolioService;
  let httpService: HttpService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
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

    portfolioService = module.get<PortfolioService>(PortfolioService);
    portfolioRepository = module.get<Repository<Portfolio>>(
      getRepositoryToken(Portfolio),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(portfolioService).toBeDefined();
  });

  it('should create a portfolio', async () => {
    // Mock repository save method
    const mockPortfolio = new Portfolio();
    mockPortfolio.id = 'port-id';
    mockPortfolio.cryptocurrencies = [];
    mockPortfolio.userId = 'user-id';
    mockPortfolio.createdAt = Date();

    jest.spyOn(portfolioRepository, 'save').mockResolvedValue(mockPortfolio);

    const result = await portfolioService.createPortfolio('testUser');
    expect(result).toEqual(mockPortfolio);
  });
});
