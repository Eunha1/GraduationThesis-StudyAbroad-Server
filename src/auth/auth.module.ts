import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RoleGuard } from 'src/role/role.guard';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [StaffModule,JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, RoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
