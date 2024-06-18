import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from 'src/entity/portfolio.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PortfolioService {
  @InjectRepository(Portfolio)
  private portfoliosRepository: Repository<Portfolio>;
  constructor(private httpService: HttpService) {}

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

  private async coinInfoRequestCoingecko(id: string) {
    const coinInfo = await this.httpService
      .get(`${process.env.DATA_PROVIDER_URL}/v3/coins/${id}`,)
      .toPromise();
    return coinInfo.data;
  }

  async getOnePortfolio(userId: string) {
    const coin = [];
    const portfolios = [];

    try {
      console.log(userId);
      const portfolio = await this.portfoliosRepository.findOne({
        where: [{ userId: userId }],
      });
      //   const x = portfolio.cryptocurrencies[0].symbol
      const cryptocurrencies = Object.entries(portfolio.cryptocurrencies).map(
        ([key, value]) => {
          return { key: key, value: value };
        },
      );

      for (let i = 0; i < cryptocurrencies.length; i++) {
        if (process.env.DATA_PROVIDER === 'coingecko') {
          if (coin.length == 0) {
            const coins = await this.httpService
              .get(`${process.env.DATA_PROVIDER_URL}/v3/coins/list`)
              .toPromise();
            coin.push(coins.data);
          }
          const x = await coin[0].filter(
            (x) => x.symbol == cryptocurrencies[i].value.symbol,
          );
          const coin_data = await this.coinInfoRequestCoingecko(x[0].id);
          portfolios.push({
            "logo": coin_data.image.small,
            "name": coin_data.name,
            "price": cryptocurrencies[i].value.price,
            "P/L_24h": coin_data.market_data.price_change_percentage_24h_in_currency.btc
          });
        } else if (process.env.DATA_PROVIDER === 'coinmarketcap') {
        }
      }
      //  console.log(coin)
      return portfolios;
    } catch (error) {
      return error;
    }
  }
}
