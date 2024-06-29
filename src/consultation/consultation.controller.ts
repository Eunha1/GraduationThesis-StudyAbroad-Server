import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { newConsultation, pagination } from './consultation.dto';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/enum/roles.enum';
import { RoleGuard } from 'src/role/role.guard';

@Controller('api/consultation')
export class ConsultationController {
  constructor(private readonly service: ConsultationService) {}

  @Post('create')
  @Roles(Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  async createNewConsultation(@Body() newConsultation: newConsultation, @Req() req:any) {
    if (
      !newConsultation.customer_phone ||
      newConsultation.customer_phone === ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điển thông tin số điện thoại khách hàng',
      };
    }
    return await this.service.createNewConsultation(newConsultation, req.user.sub);
  }

  @Get('list')
  @Roles(Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  async getListConsultation(@Body() pagination: pagination, @Req() req: any) {
    return await this.service.getListConsultation(pagination, req.user.sub);
  }

  @Get('detail/:id')
  @Roles(Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  async getConsultationById(@Param('id') consultationId: string) {
    return await this.service.getConsultationById(consultationId);
  }

  @Post('update/:id')
  @Roles(Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  async updateConsultation(
    @Param('id') consultationId: string,
    @Body() body: any,
  ) {
    return await this.service.updateConsultation(consultationId, body);
  }

  @Post('delete/:id')
  @Roles(Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteConsultation(@Param('id') id: string) {
    return await this.service.deleteConsultation(id);
  }
}
