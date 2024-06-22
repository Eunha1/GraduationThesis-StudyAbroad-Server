import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { createStaffDto, updateStaffInfo } from './staff.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Role } from 'src/enum/roles.enum';

@Controller('api/staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Post('sign-up')
  async create(@Body() createStaffDto: createStaffDto) {
    return await this.service.createStaff(createStaffDto);
  }

  @Post('update-profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Body() updateStaffInfo: updateStaffInfo,
    @Req() req: any,
  ) {
    return await this.service.updateStaffInfo(req.user.email, updateStaffInfo);
  }

  @Get('/list-staff')
  @UseGuards(AuthGuard)
  async getListStaffByRole(@Query('role') role: Role) {
    if (
      ![Role.ADMIN, Role.ADMISSION_OFFICER, Role.EDU_COUNSELLOR].includes(role)
    ) {
      return {
        status: 0,
        message: 'Không tồn tại role này',
      };
    }
    return await this.service.getStaffByRole(role);
  }
}
