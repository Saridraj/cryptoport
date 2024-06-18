import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Portfolio } from 'src/entity/portfolio.entity';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Portfolio ]),
  ],
  controllers: [AuthController],
  providers: [AuthService,PortfolioService]
})
export class AuthModule {}
