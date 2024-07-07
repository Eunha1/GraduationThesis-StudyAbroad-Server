import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../enum/roles.enum';
import { Roles } from '../role/role.decorator';
import { createAdviseInfo, pagination } from './customer.dto';

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
  async getListAdviseInfo(@Query() pagination: pagination) {
    return await this.service.getListAdviseInfo(pagination);
  }

  @Get('advise-info/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getAdviseInfoById(@Param('id') adviseInfoId: string) {
    return await this.service.getAdviseInfoById(adviseInfoId);
  }

  @Get('list-advise')
  @UseGuards(AuthGuard)
  async getAdviseInfoByStatus(
    @Query('status') status: number,
    @Query() pagination: pagination,
  ) {
    return await this.service.getAdviseInfoByStatus(status, pagination);
  }

  @Post('change-status/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async changeStatus(@Param('id') id: string, @Query('status') status: number){
    return await this.service.changeStatusCustomer(id, status)
  }
}
