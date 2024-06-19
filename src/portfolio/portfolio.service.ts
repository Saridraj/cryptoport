import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entity/portfolio.entity';
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

  private async coingeckoProvider(cryptocurrencies) {
    const userCoins = [];
    for (let i = 0; i < cryptocurrencies.length; i++) {
      const coins = await this.httpService
        .get(`${process.env.DATA_PROVIDER_URL}/v3/coins/list`)
        .toPromise();
      const coin = await coins.data.filter(
        (x) => x.symbol == cryptocurrencies[i].value.symbol,
      );
      const coin_data = await this.httpService
        .get(`${process.env.DATA_PROVIDER_URL}/v3/coins/${coin[0].id}`)
        .toPromise();
      userCoins.push({
        logo: coin_data.data.image.small,
        name: coin_data.data.name,
        price_BTC: coin_data.data.market_data.current_price.btc.toFixed(12),
        P_L_24h:
          coin_data.data.market_data.price_change_percentage_24h_in_currency
            .btc,
      });
    }
    return userCoins;
  }

  private async coinmarketcapProvider(cryptocurrencies) {
    const userCoins = [];
    for (let i = 0; i < cryptocurrencies.length; i++) {
      console.log(cryptocurrencies[i].value.symbol);
      const config = {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_KEY,
        },
      };
      const coin = await this.httpService
        .get(
          `${process.env.DATA_PROVIDER_URL}/v2/cryptocurrency/info?symbol=${cryptocurrencies[i].value.symbol}`,
          config,
        )
        .toPromise();
      const coinInfo = Object.entries(coin.data.data).map(([key, value]) => {
        return { key: key, value: value };
      });

      const coinPrice = await this.httpService
        .get(
          `${process.env.DATA_PROVIDER_URL}/v1/cryptocurrency/quotes/latest?symbol=${cryptocurrencies[i].value.symbol}&convert=BTC`,
          config,
        )
        .toPromise();
      const coinPriceData = Object.entries(coinPrice.data.data).map(
        ([key, value]) => {
          return { key: key, value: value };
        },
      );

      userCoins.push({
        logo: coinInfo[0].value[0].logo,
        name: coinInfo[0].value[0].name,
        price_BTC: Object(coinPriceData[0].value).quote.BTC.price.toFixed(12),
        P_L_24h: Object(coinPriceData[0].value).quote.BTC.percent_change_24h,
      });
    }
    return userCoins;
  }

  async getOnePortfolio(userId: string) {
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
      if (process.env.DATA_PROVIDER === 'coingecko') {
        return this.coingeckoProvider(cryptocurrencies);
      } else if (process.env.DATA_PROVIDER === 'coinmarketcap') {
        return this.coinmarketcapProvider(cryptocurrencies);
      }
    } catch (error) {
      return error;
    }
  }
}

// for (let i = 0; i < cryptocurrencies.length; i++) {
//   if (process.env.DATA_PROVIDER === 'coingecko') {
//     const coin = [];
//     if (coin.length == 0) {
//       const coins = await this.httpService
//         .get(`${process.env.DATA_PROVIDER_URL}/v3/coins/list`)
//         .toPromise();
//       coin.push(coins.data);
//     }
//     const coin_info = await coin[0].filter(
//       (x) => x.symbol == cryptocurrencies[i].value.symbol,
//     );
//     const coin_data = await this.httpService
//       .get(`${process.env.DATA_PROVIDER_URL}/v3/coins/${coin_info[0].id}`)
//       .toPromise();
//     portfolios.push({
//       logo: coin_data.data.image.small,
//       name: coin_data.data.name,
//       price_BTC: coin_data.data.market_data.current_price.btc.toFixed(10),
//       'P/L_24h':
//         coin_data.data.market_data.price_change_percentage_24h_in_currency
//           .btc,
//     });
//   } else if (process.env.DATA_PROVIDER === 'coinmarketcap') {
//     const config = {
//       headers: {
//         'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_KEY,
//       },
//     };
//     const coinMarketCapInfo = await this.httpService
//       .get(
//         `${process.env.DATA_PROVIDER_URL}/v2/cryptocurrency/info?symbol=${cryptocurrencies[i].value.symbol}`,
//         config,
//       )
//       .toPromise();
//     const x = coinMarketCapInfo.data.data;
//     console.log(x);
//   }
// }
//  console.log(coin)
