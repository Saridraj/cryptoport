import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from './portfolio.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Portfolio } from '../entity/portfolio.entity';
import { Repository } from 'typeorm';
import { PortfolioService } from './portfolio.service';
import { HttpService } from '@nestjs/axios';

describe('PortfolioController', () => {
  let portfolioController: PortfolioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioController],
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

    portfolioController = module.get<PortfolioController>(PortfolioController);
  });

  it('should be defined', () => {
    expect(portfolioController).toBeDefined();
  });
});
