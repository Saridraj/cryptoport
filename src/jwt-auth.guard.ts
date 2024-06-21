import { Injectable, CanActivate } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Authorize implements CanActivate {
  async canActivate(ExecutionContext) {
    try {
      const token =
        ExecutionContext.args[0].headers.authorization.split(' ')[1];
      const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
      if (tokenVerify) {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
