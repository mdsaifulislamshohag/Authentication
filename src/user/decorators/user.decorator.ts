import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data) {
    return !request.user ? null : request.user[data];
  } else {
    return !request.user ? null : request.user;
  }
});
