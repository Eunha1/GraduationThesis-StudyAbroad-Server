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
    if (
      !['EDU_COUNSELLOR', 'ADMISSION_OFFICER'].includes(createStaffDto.role)
    ) {
      return {
        status: 0,
        message: 'Role chỉ có thể là EDU_COUNSELLOR hoặc ADMISSION_OFFICER',
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

  async getAllStaff(pagination: any): Promise<any> {
    const countDocument = await this.staffModel
      .find({ $and: [{ role: { $ne: 'ADMIN' } }] })
      .countDocuments();
    const page = parseInt(pagination.page) ?? 1;
    const limit = parseInt(pagination.limit) ?? countDocument;
    const skip = limit * (page - 1);
    const listStaff = await this.staffModel
      .find({ $and: [{ role: { $ne: 'ADMIN' } }] })
      .limit(limit)
      .skip(skip);
    const totalPage = Math.ceil(countDocument / limit);
    const data = [];
    let count = 1;
    for (let item of listStaff) {
      const obj = {
        _id: item._id,
        email: item.email,
        role: item.role,
        stt: count++,
      };
      data.push(obj);
    }
    if (!(data.length > 0)) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: {
        data: data,
        paginate: {
          page: page,
          limit: limit,
          total: countDocument,
          total_page: totalPage,
        },
      },
    };
  }

  async deleteAccount(_id: string): Promise<any> {
    const data = await this.staffModel.findByIdAndDelete(_id);
    if (!data) {
      return {
        status: 0,
        message: 'Xóa tài khoản thất bại',
      };
    }
    return {
      status: 1,
      message: 'Xóa tài khoản thành công',
    };
  }

  async findStaffbyId(_id: string): Promise<any> {
    const staff_info = await this.staffModel.findById(_id);
    return staff_info;
  }
}
