import { Post, HttpCode, Controller, Get, HttpStatus, Inject, Body, Req, UseGuards, Query } from '@nestjs/common';

import { ClientService } from './client.service';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dtos/sign.in.dto';
import { Public } from './decorators/public.decorator'
import { SignUpDto } from './dtos/sign.up.dto';
import { PasswordConfirmationGuard } from './guards/password.confirmation.guard';
import { Token } from './decorators/token.decorator';
import { CreateListDto } from './dtos/create.list.dto';
import { GetListDto } from './dtos/get,list.dto';

@Controller()
export class ClientController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('PLANS_SERVICE') private readonly plansClient: ClientProxy,
    private readonly clientService: ClientService
  ) {}

  @Get('users/index')
  async getUsers(): Promise<string> {
    try {
      return this.usersClient.send<string>({cmd: 'getUsers'}, {}).toPromise();
    } catch (error) {
      console.error('Error in /users/index request:', error.message);
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('users/login')
  async login(@Body() signInDto: SignInDto): Promise<string> {
    try {
      return this.usersClient.send<string>({cmd: 'login'}, signInDto).toPromise();
    } catch (error) {
      console.error('Error in /users/login request:', error.message);
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PasswordConfirmationGuard)
  @Post('users/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    try {
      return this.usersClient.send<string>({cmd: 'signUp'}, signUpDto).toPromise();
    } catch (error) {
      console.error('Error in /users/signup request:', error.message);
    }
  }

  @Get('users/profile')
  getProfile(@Req() req) {
    return true;
  }

  @Post('lists/new')
  async newList(
    @Body() data: CreateListDto,
    @Token() token: string,
    ): Promise<string> {
    try {
      const listName = data.listName;
      return this.plansClient.send<string>({cmd: 'newList'}, { listName, token }).toPromise();
    } catch (error) {
      console.error('Error in /lists/new request:', error.message);
    }
  }

  @Get('list')
  async getList(
    @Query() { list }: GetListDto,
  ): Promise<string> {
    try {
      return this.plansClient.send<string>({cmd: 'getList'}, { list }).toPromise();
    } catch (error) {
      console.error('Error in /list request:', error.message);
    }
  }
}
