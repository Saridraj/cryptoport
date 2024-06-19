import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CryptoDataService } from './crypto-data.service';
import { Portfolio } from '../entity/portfolio.entity';



describe('CryptoDataService', () => {
  let portfolioRepository: Repository<Portfolio>;
  let service: CryptoDataService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CryptoDataService>(CryptoDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
