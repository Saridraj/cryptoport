import { Module } from '@nestjs/common';
import { CryptoDataController } from './crypto-data.controller';
import { CryptoDataService } from './crypto-data.service';
import { HttpModule } from '@nestjs/axios';
import { Portfolio } from 'src/entity/portfolio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [HttpModule,TypeOrmModule.forFeature([Portfolio])],
  controllers: [CryptoDataController],
  providers: [CryptoDataService]
})
export class CryptoDataModule {}
