import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from '../entity/portfolio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CryptoDataService } from '../crypto-data/crypto-data.service';
@Module({
  imports: [HttpModule,TypeOrmModule.forFeature([Portfolio])],
  controllers: [PortfolioController],
  providers: [PortfolioService,CryptoDataService ],
})
export class PortfolioModule {}
