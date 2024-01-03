// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { SignInDto } from './dtos/sign.in.dto';
import { SignUpDto } from './dtos/sign.up.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('MONGO_SERVICE') private client: ClientProxy,
  ) {}

  @MessagePattern({cmd: 'getUsers'})
  getUsers(): Promise<unknown> {
    return this.userService.getUsers();
  }

  @MessagePattern({cmd: 'login'})
  login(data: SignInDto): Promise<unknown> {
    return this.userService.login(data);
  }

  @MessagePattern({cmd: 'signUp'})
  signUp(data: SignUpDto): Promise<unknown> {
    return this.userService.signUp(data);
  }
}
