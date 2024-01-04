import { Post, HttpCode, Controller, Get, HttpStatus, Inject, Body, Req } from '@nestjs/common';

import { ClientService } from './client.service';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dtos/sign.in.dto';
import { Public } from './decorators/public.decorator'
import { SignUpDto } from './dtos/sign.up.dto';

@Controller()
export class ClientController {
  constructor(
    @Inject('USERS_SERVICE') private client: ClientProxy,
    private readonly clientService: ClientService
  ) {}

  @Get()
  getData() {
    return this.clientService.getData();
  }

  @Get('users')
  async getUsers(): Promise<string> {
    try {
      return this.client.send<string>({cmd: 'getUsers'}, {}).toPromise();
    } catch (error) {
      console.error('Error in /users request:', error.message);
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: SignInDto): Promise<string> {
    try {
      return this.client.send<string>({cmd: 'login'}, signInDto).toPromise();
    } catch (error) {
      console.error('Error in /users request:', error.message);
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    try {
      return this.client.send<string>({cmd: 'signUp'}, signUpDto).toPromise();
    } catch (error) {
      console.error('Error in /users request:', error.message);
    }
  }

  @Get('profile')
  getProfile(@Req() req) {
    return true;
  }
}
