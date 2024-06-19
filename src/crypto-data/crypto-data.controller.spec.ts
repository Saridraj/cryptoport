import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CryptoDataController } from './crypto-data.controller';
import { CryptoDataService } from './crypto-data.service';
import { Portfolio } from '../entity/portfolio.entity';


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
