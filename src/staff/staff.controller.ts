import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { createStaffDto, updateStaffInfo } from './staff.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

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
}
