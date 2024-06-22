import { Injectable } from '@nestjs/common';
import { Staff_Info, Staff_InfoDocument } from './staff.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createStaffDto, updateStaffInfo } from './staff.dto';
import { hash } from 'bcrypt';
import { Role } from 'src/enum/roles.enum';

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

  async updateStaffInfo(
    email: string,
    updateStaffInfo: updateStaffInfo,
  ): Promise<any> {
    const staff_info = await this.staffModel.findOneAndUpdate(
      { email: email },
      {
        name: updateStaffInfo.name,
        phone: updateStaffInfo.phone,
        avatar: updateStaffInfo.avatar,
        address: updateStaffInfo.address,
        updated_at: new Date(),
      },
    );

    if (!staff_info) {
      return {
        status: 0,
        message: 'Cập nhật không thành công',
      };
    }

    return {
      status: 1,
      message: ' Cập nhật thành công',
    };
  }

  async getStaffByRole(role: Role): Promise<any> {
    const listStaff = await this.staffModel.find({ role: role });
    if (!listStaff) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }
    const data = [];
    listStaff.map((item, index) => {
      const obj = {
        _id: item._id,
        email: item.email,
        name: item.name,
        phone: item.phone,
      };
      data.push(obj);
    });
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: data,
    };
  }

  async getRole(_id: any): Promise<any> {
    const staff_info = await this.staffModel.findById(_id);
    if (
      !staff_info ||
      ![Role.ADMIN, Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER].includes(
        staff_info.role,
      )
    )
      return null;
    return staff_info.role;
  }

  async findStaffbyId(_id: string): Promise<any> {
    const staff_info = await this.staffModel.findById(_id);
    return staff_info;
  }
}
