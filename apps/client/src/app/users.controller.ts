import { Post, HttpCode, Controller, Get, HttpStatus, Inject, Body, Delete, UseGuards, Query, Param } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dtos/sign.in.dto';
import { Public } from './decorators/public.decorator'
import { SignUpDto } from './dtos/sign.up.dto';
import { PasswordConfirmationGuard } from './guards/password.confirmation.guard';
import { GetUserProfileGuard } from './guards/get.user.profile.guard';
import { Token } from './decorators/token.decorator';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get('index')
  async getUsers(): Promise<string> {
    try {
      return this.usersClient.send<string>({cmd: 'getUsers'}, {}).toPromise();
    } catch (error) {
      console.error('Error in /users/index request:', error.message);
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
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
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    try {
      return this.usersClient.send<string>({cmd: 'signUp'}, signUpDto).toPromise();
    } catch (error) {
      console.error('Error in /users/signup request:', error.message);
    }
  }

  @Get('profile')
  @UseGuards(GetUserProfileGuard)
  getUserProfile(@Query() query) {
    try {
      return this.usersClient.send<string>({cmd: 'getUserProfile'}, query).toPromise();
    } catch (error) {
      console.error('Error in /users/profile request:', error.message);
    }
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @Token() token: string,
    ) {
    try {
      return this.usersClient.send<string>({cmd: 'deleteUser'}, { id, token }).toPromise();
    } catch (error) {
      console.error('Error in /users/delete request:', error.message);
    }
  }
}
