import { Test, TestingModule } from '@nestjs/testing';
import { CryptoDataService } from './crypto-data.service';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entity/portfolio.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

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
