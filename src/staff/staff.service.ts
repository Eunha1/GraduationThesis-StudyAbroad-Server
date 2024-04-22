import { Injectable } from '@nestjs/common';
import { Staff_Info, Staff_InfoDocument } from './staff.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createStaffDto } from './staff.dto';
import { hash } from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff_Info.name)
    private readonly staffModel: Model<Staff_InfoDocument>,
  ) {}

  makeKey(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async findStaff(email: string): Promise<Staff_InfoDocument> {
    return await this.staffModel.findOne({ email: email });
  }

  async createStaff(createStaffDto: createStaffDto): Promise<any> {
    const oldStaff = await this.findStaff(createStaffDto.email);
    if (oldStaff) {
      return {
        status: 0,
        message: 'Email đã được sử dụng bởi tài khoản khác!',
      };
    }
    const key = this.makeKey(16);
    const newStaff = {
      email: createStaffDto.email,
      password: await hash(createStaffDto.password, 10),
      role: createStaffDto.role,
    };
    const staff = await new this.staffModel(newStaff).save();
    if (staff) {
      return {
        status: 1,
        message: 'Sign up success',
      };
    } else {
      return {
        status: 0,
        message: 'Sign up fail',
      };
    }
  }
}
