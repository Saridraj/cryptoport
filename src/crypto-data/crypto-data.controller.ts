import { Body, Controller, Get } from '@nestjs/common';
import { CryptoDataService } from './crypto-data.service';

@Controller('crypto-data')
export class CryptoDataController {
  constructor(private cryptoDataService: CryptoDataService) {}

  @Get()
  async getCoinsList(@Body() data:string[]) {
    console.log("ctl: ",data['provider'])
    const coins = await this.cryptoDataService. getCoinsList(data['provider']);
    return coins;
  }
}
