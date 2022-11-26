import { ExpressRequest } from '../../types/expressRequest.interface';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class GuardAuth implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    //console.log(request.user)
    if (request.user) {
      return true;
    }

    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
