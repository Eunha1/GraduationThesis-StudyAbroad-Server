import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { newConsultation, updateConsultation } from './consultation.dto';

@Controller('api/consultation')
export class ConsultationController {
  constructor(private readonly service: ConsultationService) {}

  @Post('create-consultation')
  @UseGuards(AuthGuard)
  async createNewConsultation(@Body() newConsultation: newConsultation) {
    if (
      !newConsultation.customer_phone ||
      newConsultation.customer_phone === ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điển thông tin số điện thoại khách hàng',
      };
    }
    return await this.service.createNewConsultation(newConsultation);
  }

  @Get('list-consultation')
  @UseGuards(AuthGuard)
  async getListConsultation() {
    return await this.service.getListConsultation();
  }

  @Get('consultation-detail/:consultation_id')
  @UseGuards(AuthGuard)
  async getConsultationById(@Param('consultation_id') consultationId: string) {
    return await this.service.getConsultationById(consultationId);
  }

  @Post('consultation-detail/:consultation_id')
  @UseGuards(AuthGuard)
  async updateConsultation(
    @Param('consultation_id') consultationId: string,
    @Body() updateConsultation: updateConsultation,
  ) {
    return await this.service.updateConsultation(
      consultationId,
      updateConsultation,
    );
  }
}
