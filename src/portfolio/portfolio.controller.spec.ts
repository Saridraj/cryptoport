import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { CryptoDataService } from '../crypto-data/crypto-data.service';
import { Portfolio } from '../entity/portfolio.entity';


describe('PortfolioController', () => {
  let portfolioController: PortfolioController;
  let portfolioService: PortfolioService ;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [
        PortfolioService,
        CryptoDataService ,
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
        {
          provide: PortfolioService,
          useValue: {
            getOnePortfolio: jest.fn(),
          },
        },
      ],
    }).compile();
    portfolioController = module.get<PortfolioController>(PortfolioController);
    portfolioService = module.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(portfolioController).toBeDefined();
  });

  it('should return the portfolio data', async () => {
    const portfolioData =[
      {
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4546.png',
        name: '01coin',
        price_BTC: '0.000000007000',
        P_L_24h: -0.40437866,
      },
      {
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/19546.png',
        name: 'o-mee',
        price_BTC: '0.000000000943',
        P_L_24h: -6.23230259,
      },
    ]
    const userId = 'user123';
    jest.spyOn(portfolioService, 'getOnePortfolio').mockResolvedValue(portfolioData);
    const result = await portfolioController.getUserPortfolio(userId);
    expect(result).toEqual(portfolioData);
  });
});
