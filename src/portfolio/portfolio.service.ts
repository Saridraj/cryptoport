import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from 'src/entity/portfolio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PortfolioService {
  @InjectRepository(Portfolio)
  private portfoliosRepository: Repository<Portfolio>;

  async createPortfolio(userId: string) {
    try {
      const newPort = await this.portfoliosRepository.save({
        cryptocurrencies: [],
        userId: userId,
        createdAt: Date(),
      });
      return newPort;
    } catch (error) {
      return error;
    }
  }

  async getOnePortfolio(userId: string) {
    try {
      const portfolio = await this.portfoliosRepository.findOne({
        where: [{ userId: userId }],
      });
      return portfolio;
    } catch (error) {
      return error;
    }
  }
}
