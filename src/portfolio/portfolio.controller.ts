import { Controller, Post, Get, Body, UseGuards, Query, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Authorize } from 'src/jwt-auth.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get(':id')
  @UseGuards(Authorize)
  async getUserPortfolio(@Param() userId: string) {
    const portfolio = await this.portfolioService.getOnePortfolio(userId);
    return portfolio ;
  }
}
