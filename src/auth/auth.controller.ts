import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { Request } from 'express';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/enum/roles.enum';
import { Roles } from 'src/role/role.decorator';
import { AuthGuard } from './guards/auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);
  Logger(functionName: string, input: any = null) {
    this.logger.log(`Function: ${functionName} | input:`, input);
  }
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() signDto: Record<string, any>) {
    this.Logger('login', signDto);
    if (
      !signDto.email ||
      signDto.email === '' ||
      !signDto.password ||
      signDto.password === ''
    ) {
      return {
        status: 0,
        message: 'Please enter email and password',
      };
    }
    return await this.authService.signIn(signDto.email, signDto.password);
  }

  @Get('/test-role')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async logout() {
    return 'test roles';
  }

  @Get('/auth-guard')
  @UseGuards(AuthGuard)
  async testAuth() {
    return {
      status: '1',
      message: 'test success',
    };
  }
}
