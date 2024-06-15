import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(user: User) {
    try {
      const userVerify = await this.usersRepository.findOne({
        where: [{ email: user.email }],
      });
      if (!userVerify) {
        const HashedPassword = await bcrypt.hash(user.password, 12);
        const newUser = await this.usersRepository.save({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: HashedPassword,
          registeredAt: Date(),
        });
        return newUser;
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
      return res;
    } else if (doMatch == true) {
      const UserAuthenticatedInfo = {
        id: UserAuthenticated.id,
        firstname: UserAuthenticated.firstname,
        lastname: UserAuthenticated.lastname,
        email: UserAuthenticated.email,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '15d',
        }),
      };
      return UserAuthenticatedInfo;
    } else {
      const res = response.status(500);
      return res;
    }
  }

}
