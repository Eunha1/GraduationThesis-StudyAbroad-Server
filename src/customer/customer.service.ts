import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { Model } from 'mongoose';
import { createAdviseInfo } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async createAdviseInfo(createAdvideInfo: createAdviseInfo): Promise<any> {
    const oldPhone = await this.customerModel.findOne({
      phone: createAdvideInfo.phone,
    });
    const oldEmail = await this.customerModel.findOne({
      email: createAdvideInfo.email,
    });
    if (oldPhone || oldEmail) {
      return {
        status: 0,
        message: `Bạn đã đăng kí tư vấn bằng email : ${oldEmail.email} hoặc số điện thoại : ${oldPhone.phone} này , vui lòng chờ đợi liên hệ để được tư vấn`,
      };
    }
    const info = {
      ...createAdvideInfo,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newInfo = await new this.customerModel(info).save();
    if (!newInfo) {
      return {
        status: 0,
        message: 'Đăng kí thất bại',
      };
    }
    return {
      status: 1,
      message: 'Đăng kí thành công',
      data: newInfo,
    };
  }

  async getListAdviseInfo(): Promise<any> {
    const info = await this.customerModel.find({});
    if (!info) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    let data = [];
    info.map((item, index) => {
      const obj = {
        stt: index,
        _id: item._id,
        phone: item.phone,
        name: item.name,
        address: item.address,
        email: item.email,
        status: item.status,
        level: item.level,
        destination: item.destination,
        question: item.question,
        created_at: item.created_at,
      };
      data.push(obj);
    });
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: data,
    };
  }

  async getAdviseInfoById(_id: string): Promise<any> {
    const info = await this.customerModel.findOne({ _id: _id });
    if (!info) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }

    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: info,
    };
  }

  async findCustomerByPhone(phone: string): Promise<CustomerDocument> {
    return await this.customerModel.findOne({ phone: phone });
  }

  async findCustomerById(_id: string): Promise<CustomerDocument> {
    return await this.customerModel.findById(_id);
  }
}
