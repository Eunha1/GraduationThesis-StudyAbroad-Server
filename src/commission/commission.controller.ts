import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { Roles } from '../role/role.decorator';
import { Role } from '../enum/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { newCommission } from './commission.dto';

@Controller('api/commission')
export class CommissionController {
  constructor(private readonly service: CommissionService) {}

  @Get('list-commission')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListCommission() {
    return await this.service.getListCommission();
  }

  @Post('create-commission')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async createNewCommission(@Body() newCommission: newCommission) {
    if (!newCommission.customer_phone || newCommission.customer_phone === '') {
      return {
        status: 0,
        message: 'Vui long điền số điện thoại khách hàng',
      };
    }
    return await this.service.createNewCommission(newCommission);
  }

  @Post('update-status/:commission_id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async updateStatusCommission(
    @Param('commission_id') commissionId: string,
    @Body() newStatus: any,
  ) {
    if (!newStatus || newStatus === '') {
      return {
        status: 0,
        message: 'Vui lòng điền trạng thái',
      };
    }
    return await this.service.updateStatusCommission(commissionId, newStatus);
  }
}
