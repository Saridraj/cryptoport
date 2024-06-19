import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { response } from 'express';
import { PortfolioService } from '../portfolio/portfolio.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private portfolioService: PortfolioService,
  ) {}

  async register(user: User) {
    try {
      //Validate existing user.
      const existingUser = await this.usersRepository.findOne({
        where: [{ email: user.email }],
      });

      //Save user data.
      if (!existingUser) {
        const HashedPassword = await bcrypt.hash(user.password, 12);
        const newUser = await this.usersRepository.save({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: HashedPassword,
          registeredAt: Date(),
        });
        const userId = newUser.id;
        console.log(newUser.id);
        if (newUser) {
          //Connect to portfolio service to create portfolio of user.
          const portfolio = await this.portfolioService.createPortfolio(userId);
        }
        const useInfo = {
          id:newUser.id,
          fisrtname:newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          registeredAt: newUser.registeredAt
        }
        return useInfo;
      } else if (user) {
        const status = response.status(422);
        const msg = (response.statusMessage =
          'This email has already been registered.');
        return status;
      }
    } catch (error) {
      return error;
    }
  }

  async logIn(user: User) {
    try {
      //Find user from database.
      const UserAuthenticated = await this.usersRepository.findOne({
        where: [{ email: user.email }],
      });

      //Compare password.
      const doMatch = await bcrypt.compare(
        user.password,
        UserAuthenticated.password,
      );

      if (doMatch == false) {
        const res = response.status(404);
        const msg = (response.statusMessage = 'Email or password invalid');
        return res;
      } else if (doMatch == true) {
        const UserInfo = {
          id: UserAuthenticated.id,
          firstname: UserAuthenticated.firstname,
          lastname: UserAuthenticated.lastname,
          email: UserAuthenticated.email,
          token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
          }),
        };
        return UserInfo;
      }
    } catch (error) {
      return error
    }
  }
}
