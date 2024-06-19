import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { AuthService } from './auth.service';
// import { Authorize } from 'src/authorize.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: User) {
    const register = await this.authService.register(user);
    return register;
  }

  @Post('logIn')
  async logIn(@Body() user: User) {
    const logInUser = await this.authService.logIn(user);
    return logInUser;
  }

}
