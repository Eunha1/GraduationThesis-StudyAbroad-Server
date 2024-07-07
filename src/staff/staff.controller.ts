import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { createStaffDto, pagination, updateStaffInfo } from './staff.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Role } from 'src/enum/roles.enum';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

@Controller('api/staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Post('sign-up')
  async create(@Body() createStaffDto: createStaffDto) {
    if (
      !createStaffDto.email ||
      createStaffDto.email == '' ||
      !createStaffDto.password ||
      createStaffDto.password == '' ||
      !createStaffDto.role ||
      createStaffDto.role == ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điền đầy đủ thông tin',
      };
    }
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

  @Get('/all-staff')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getAllStaff(@Query() pagination: pagination) {
    return await this.service.getAllStaff(pagination);
  }

  @Post('/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteAccount(@Param('id') id: string) {
    return await this.service.deleteAccount(id);
  }
}
