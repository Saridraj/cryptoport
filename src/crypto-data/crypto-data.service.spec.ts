import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CryptoDataService } from './crypto-data.service';
import { Portfolio } from '../entity/portfolio.entity';



describe('CryptoDataService', () => {
  let cryptoDataService: CryptoDataService;
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

    cryptoDataService = module.get<CryptoDataService>(CryptoDataService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(cryptoDataService).toBeDefined();
  });


  describe('coingeckoProvider', () => {
    it('should fetch and process coin data', async () => {
      const cryptocurrencies = [
        { key: '0', value: { symbol: 'zoc' } },
        { key: '1', value: { symbol: 'ome' } },
      ];
      const coingeckoResponse = [
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
      ];
  
      jest
      .spyOn(cryptoDataService, 'coingeckoProvider')
      .mockResolvedValue(coingeckoResponse);
  
      const result = await cryptoDataService.coingeckoProvider(cryptocurrencies);
      expect(result).toEqual(coingeckoResponse);
    });
  });

  describe('coinmarketcapProvider', () => {
    it('should fetch and process coin data', async () => {
      const cryptocurrencies = [
        { key: '0', value: { symbol: 'zoc' } },
        { key: '1', value: { symbol: 'ome' } },
      ];
      const coinmarketcapProviderResponse = [
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
      ];
  
      jest
      .spyOn(cryptoDataService, 'coinmarketcapProvider')
      .mockResolvedValue(coinmarketcapProviderResponse);
  
      const result = await cryptoDataService.coinmarketcapProvider(cryptocurrencies);
      expect(result).toEqual(coinmarketcapProviderResponse);
    });
  });
});
