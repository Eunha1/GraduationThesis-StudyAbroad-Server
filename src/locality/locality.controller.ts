import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LocalityService } from './locality.service';
import { Roles } from '../role/role.decorator';
import { Role } from '../enum/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { createLocality } from './locality.dto';

@Controller('api/locality')
export class LocalityController {
  constructor(private readonly service: LocalityService) {}

  @Post('create-locality')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async createLocality(@Body() createLocality: createLocality) {
    if (
      !createLocality.area ||
      createLocality.area == '' ||
      !createLocality.country ||
      createLocality.country == ''
    ) {
      return {
        status: 0,
        message: 'Please enter all fields',
      };
    }
    return await this.service.createLocality(createLocality);
  }

  @Get('get-destination')
  async getDestination(){
    return await this.service.getDestination()
  }
}
