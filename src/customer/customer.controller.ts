import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../enum/roles.enum';
import { Roles } from '../role/role.decorator';
import { createAdviseInfo } from './customer.dto';

@Controller('api/customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Post('advise-info')
  async createAdvideInfo(@Body() createAdvideInfo: createAdviseInfo) {
    return await this.service.createAdviseInfo(createAdvideInfo);
  }

  @Get('advise-info')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListAdviseInfo() {
    return await this.service.getListAdviseInfo();
  }

  @Get('advise-info/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getAdviseInfoById(@Param('id') adviseInfoId: string) {
    return await this.service.getAdviseInfoById(adviseInfoId);
  }
}
