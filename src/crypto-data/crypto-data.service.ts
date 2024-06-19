import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entity/portfolio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CryptoDataService {
  @InjectRepository(Portfolio)
  private portfoliosRepository: Repository<Portfolio>;
  constructor(private httpService: HttpService) {}

  async getCoinsList(provider: string) {
    console.log(provider);
    if (provider === 'coingecko') {
      const response = await this.httpService
        .get(`https://api.coingecko.com/api/v3/coins/list`)
        .toPromise();
      return response.data;
    } else if (provider === 'coinmarketcap') {
      const response = await this.httpService
        .get(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
          {
            headers: {
              'X-CMC_PRO_API_KEY': 'a4033b90-cbe1-465f-bcfb-c4c9cb0d8074',
            },
          },
        )
        .toPromise();
      return response.data;
    }
  }

  async coingeckoProvider(cryptocurrencies) {
    console.log(cryptocurrencies)
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

 async coinmarketcapProvider(cryptocurrencies) {
  console.log(cryptocurrencies) 
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

  async getPortfolio(provider: string, symbol: string) {
   const portfolio = await this.portfoliosRepository.findOne({
    where: [{ userId:"221378cc-b519-48ee-af75-331856dfba35"}]
   })
    
  }
}
