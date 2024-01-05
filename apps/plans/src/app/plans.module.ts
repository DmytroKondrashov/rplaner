import { Module } from '@nestjs/common';

import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [PlansController],
  providers: [PlansService, ConfigService],
})
export class PlansModule {}
