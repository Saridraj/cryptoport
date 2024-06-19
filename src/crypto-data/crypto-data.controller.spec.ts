import { Test, TestingModule } from '@nestjs/testing';
import { CryptoDataController } from './crypto-data.controller';
import { CryptoDataService } from './crypto-data.service';
import { HttpService } from '@nestjs/axios';
import { Portfolio } from '../entity/portfolio.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
describe('CryptoDataController', () => {
  let controller: CryptoDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoDataController],
      providers: [
        CryptoDataService,
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

    controller = module.get<CryptoDataController>(CryptoDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
