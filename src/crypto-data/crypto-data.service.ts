import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from 'src/entity/portfolio.entity';
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

  async getPortfolio(provider: string, symbol: string) {
   const portfolio = await this.portfoliosRepository.findOne({
    where: [{ userId:"221378cc-b519-48ee-af75-331856dfba35"}]
   })
    
  }
}
