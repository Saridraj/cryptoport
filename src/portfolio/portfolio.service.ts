import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entity/portfolio.entity';
import { Repository } from 'typeorm';
import { CryptoDataService } from '../crypto-data/crypto-data.service';

@Injectable()
export class PortfolioService {
  @InjectRepository(Portfolio)
  private portfoliosRepository: Repository<Portfolio>;
  constructor(
    private cryptoDataService: CryptoDataService,
  ) {}

  async createPortfolio(userId: string) {
    try {
      const newPort = await this.portfoliosRepository.save({
        cryptocurrencies: [],
        userId: userId,
        createdAt: Date(),
      });
      return newPort;
    } catch (error) {
      return error;
    } 
  }

  async getOnePortfolio(userId: string) {
    try {
      const portfolio = await this.portfoliosRepository.findOne({
        where: [{ userId: userId }],
      });
      const cryptocurrencies = Object.entries(portfolio.cryptocurrencies).map(
        ([key, value]) => {
          return { key: key, value: value };
        },
      );
      if (process.env.DATA_PROVIDER === 'coingecko') {
        return this.cryptoDataService.coingeckoProvider(cryptocurrencies);
      } else if (process.env.DATA_PROVIDER === 'coinmarketcap') {
        return this.cryptoDataService.coinmarketcapProvider(cryptocurrencies);
      }
    } catch (error) {
      return error;
    }
  }
}

