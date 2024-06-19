import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CryptoDataService {
  constructor(private httpService: HttpService) {}

  async coingeckoProvider(cryptocurrencies) {
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
    const userCoins = [];
    const config = {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_KEY,
      },
    };
    try {
      for (const crypto of cryptocurrencies) {
        const symbol = crypto.value.symbol;
        const coin = await this.httpService
          .get(
            `${process.env.DATA_PROVIDER_URL}/v2/cryptocurrency/info?symbol=${symbol}`,
            config,
          )
          .toPromise();
        const coinInfo = Object.entries(coin.data.data).map(([key, value]) => {
          return { key: key, value: value };
        });
        const logo = coinInfo[0].value[0].logo;
        const name = coinInfo[0].value[0].name;

        const coinPrice = await this.httpService
          .get(
            `${process.env.DATA_PROVIDER_URL}/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=BTC`,
            config,
          )
          .toPromise();
        const coinPriceData = Object.entries(coinPrice.data.data).map(
          ([key, value]) => {
            return { key: key, value: value };
          },
        );
        const price_BTC = Object(
          coinPriceData[0].value,
        ).quote.BTC.price.toFixed(12);
        const P_L_24h = Object(coinPriceData[0].value).quote.BTC
          .percent_change_24h;

        userCoins.push({
          logo: logo,
          name: name,
          price_BTC: price_BTC,
          P_L_24h: P_L_24h,
        });
      }
      return userCoins;
    } catch (error) {
      console.log(error);
    }
  }
}
