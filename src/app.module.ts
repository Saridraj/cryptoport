import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CryptoDataModule } from './crypto-data/crypto-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    PortfolioModule,
    CryptoDataModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}