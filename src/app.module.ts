import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { PortfolioModule } from './portfolio/portfolio.module';
import { CryptoDataModule } from './crypto-data/crypto-data.module';
import { User } from './entity/user.entity';
import { Portfolio } from './entity/portfolio.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Portfolio],
      synchronize: true,
    }),
    AuthModule,
    PortfolioModule,
    CryptoDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
