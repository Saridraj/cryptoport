import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Portfolio } from '../entity/portfolio.entity';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { CryptoDataService } from '../crypto-data/crypto-data.service';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Portfolio ]),
  ],
  controllers: [AuthController],
  providers: [AuthService,PortfolioService, CryptoDataService]
})
export class AuthModule {}
