import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { CryptoDataService } from '../crypto-data/crypto-data.service';
import { Portfolio } from '../entity/portfolio.entity';

describe('PortfolioService', () => {
  let portfolioRepository: Repository<Portfolio>;
  let portfolioService: PortfolioService;
  let cryptoDataService: CryptoDataService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        CryptoDataService,
        {
          provide: getRepositoryToken(Portfolio),
          useClass: Repository, // Mock repository class
        },
        {
          provide: CryptoDataService,
          useValue: {
            coingeckoProvider: jest.fn(), // Mock the `coingeckoProvider` method
            coinmarketcapProvider: jest.fn(), // Mock the `coinmarketcapProvider` method
          },
        },
      ],
    }).compile();

    portfolioService = module.get<PortfolioService>(PortfolioService);
    portfolioRepository = module.get<Repository<Portfolio>>(
      getRepositoryToken(Portfolio),
    );
    cryptoDataService = module.get<CryptoDataService>(CryptoDataService);

    process.env.DATA_PROVIDER = 'coingecko';
  });

  it('should be defined', () => {
    expect(portfolioService).toBeDefined();
  });

  describe('createPortFolio', () => {
    it('should create a portfolio', async () => {
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

  describe('getOnePortFolio', () => {

    it('should get user portfolio', async () => {
      const userId = 'user-id';
      const mockPortfolio = new Portfolio();
      mockPortfolio.id = 'port-id';
      mockPortfolio.cryptocurrencies = [{ symbol: 'zoc' }, { symbol: 'ome' }];
      mockPortfolio.userId = userId;
      mockPortfolio.createdAt = Date();

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
        .spyOn(portfolioRepository, 'findOne')
        .mockResolvedValue(mockPortfolio);
      jest
        .spyOn(cryptoDataService, 'coingeckoProvider')
        .mockResolvedValue(coingeckoResponse);
      const result = await portfolioService.getOnePortfolio(userId);
      expect(result).toEqual(coingeckoResponse);
      expect(portfolioRepository.findOne).toHaveBeenCalledWith({
        where: [{ userId: userId }],
      });
      expect(cryptoDataService.coingeckoProvider).toHaveBeenCalledWith(
        cryptocurrencies,
      );
    });
  });
});
