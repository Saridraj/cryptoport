import { Controller, Post, Get, Body, UseGuards, Query, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
// import { Authorize } from 'src/authorize.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get(':id')
//   @UseGuards(Authorize)
  async getUserPortfolio(@Param() data: string) {
    console.log(data)
    const portfolio = await this.portfolioService.getOnePortfolio(data['id']);
    return portfolio ;
  }
}
