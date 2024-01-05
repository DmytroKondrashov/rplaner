import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (request.headers.authorization) {
    const token = request.headers.authorization.split(' ')[1];
    request.token = token;
    return request.token;
  } else return null;
});
