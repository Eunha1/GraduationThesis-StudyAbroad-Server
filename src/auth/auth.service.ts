import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constant';
import { StaffService } from '../staff/staff.service';
import { compare } from 'bcrypt';
import { Role } from '../enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private staffService: StaffService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const staff = await this.staffService.findStaff(email);
    if (!staff) {
      return {
        status: 0,
        message: 'Không có tài khoản ứng với email',
      };
    }
    if (!(await compare(password, staff.password))) {
      return {
        status: 0,
        message: 'wrong password ! Please try again',
      };
    }

    const token = await this.getToken(email, password, staff.role);
    return {
      status: 1,
      message: 'Login success',
      token,
    };
  }

  async getToken(email: string, password: string, role: Role[]): Promise<any> {
    const payload = {
      sub: password,
      email,
      role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '8h',
    });
    // const refreshToken = await this.jwtService.signAsync(payload, {
    //     secret: jwtConstants.refresh_secret,
    //     expiresIn: '8h',
    // })

    return {
      accessToken: accessToken,
      // refreshToken: refreshToken
    };
  }
}
