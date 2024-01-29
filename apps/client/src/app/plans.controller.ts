import { Post, HttpCode, Controller, Get, HttpStatus, Inject, Body, Delete, UseGuards, Query, Param } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dtos/sign.in.dto';
import { Public } from './decorators/public.decorator'
import { SignUpDto } from './dtos/sign.up.dto';
import { PasswordConfirmationGuard } from './guards/password.confirmation.guard';
import { GetUserProfileGuard } from './guards/get.user.profile.guard';
import { Token } from './decorators/token.decorator';
import { EditUserDto } from './dtos/edit.user.dto';

@Controller('plans')
export class PlansController {
  constructor(
    @Inject('PLANS_SERVICE') private readonly plansClient: ClientProxy,
  ) {}

  @Get('index')
  async getPlans(
    @Query() listId: string,
    @Token() token: string,
    ): Promise<string> {
    try {
      return this.plansClient.send<string>({cmd: 'getPlans'}, { token, listId }).toPromise();
    } catch (error) {
      console.error('Error in /plans/index request:', error.message);
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('new')
  async createPlan(
    @Body() data,
    @Token() token: string,
    ): Promise<string> {
    try {
      return this.plansClient.send<string>({cmd: 'cretePlan'}, { token, data }).toPromise();
    } catch (error) {
      console.error('Error in /plans/new request:', error.message);
    }
  }

  // @Get('profile')
  // @UseGuards(GetUserProfileGuard)
  // getUserProfile(@Query() query) {
  //   try {
  //     return this.usersClient.send<string>({cmd: 'getUserProfile'}, query).toPromise();
  //   } catch (error) {
  //     console.error('Error in /users/profile request:', error.message);
  //   }
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('edit')
  // async edit(
  //   @Body() data: EditUserDto,
  //   @Token() token: string,
  //   ): Promise<string> {
  //   try {
  //     return this.usersClient.send<string>({cmd: 'edit'}, { data, token }).toPromise();
  //   } catch (error) {
  //     console.error('Error in /users/signup request:', error.message);
  //   }
  // }

  // @Delete(':id')
  // deleteUser(
  //   @Param('id') id: string,
  //   @Token() token: string,
  //   ) {
  //   try {
  //     return this.usersClient.send<string>({cmd: 'deleteUser'}, { id, token }).toPromise();
  //   } catch (error) {
  //     console.error('Error in /users/delete request:', error.message);
  //   }
  // }
}
