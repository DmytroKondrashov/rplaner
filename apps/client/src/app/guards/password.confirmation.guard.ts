import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordConfirmationGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { password, passwordConfirmation } = request.body;
    
    if (password !== passwordConfirmation) {
      throw new BadRequestException;
    }

    return password === passwordConfirmation;
  }
}