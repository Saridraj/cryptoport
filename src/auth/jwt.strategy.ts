// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly usersService: UsersService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'SECRET_KEY', // Use environment variable for production
//     });
//   }

//   async validate(payload: any) {
//     const user = await this.usersService.findOne(payload.email);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return { userId: user.id, username: user.username };
//   }
// }
