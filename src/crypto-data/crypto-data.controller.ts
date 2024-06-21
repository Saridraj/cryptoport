import { Body, Controller, Get } from '@nestjs/common';
import { CryptoDataService } from './crypto-data.service';

@Controller('crypto-data')
export class CryptoDataController {
  constructor(private cryptoDataService: CryptoDataService) {}

  // @Get()
  // async getCoinsMarket() {
  //   console.log("called")
  //   const coins = await this.cryptoDataService.getCoinsMarket();
  //   console.log("controller: ",coins)
  //   return coins;
  // }
}
