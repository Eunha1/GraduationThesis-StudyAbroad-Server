import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { Model } from 'mongoose';
import { createAdviseInfo, pagination } from './customer.dto';

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

  async getListAdviseInfo(pagination: any): Promise<any> {
    const countDocument = await this.customerModel
      .find({ $and: [{ status: { $ne: 1 } }] })
      .countDocuments();
    const page = parseInt(pagination.page) ?? 1;
    const limit = parseInt(pagination.limit) ?? countDocument;
    const skip = limit * (page - 1);
    const info = await this.customerModel
      .find({ $and: [{ status: { $ne: 1 } }] })
      .limit(limit)
      .skip(skip);
    const totalPage = Math.ceil(countDocument / limit);
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

  async getAdviseInfoByStatus(status: number, pagination: any): Promise<any> {
    const countDocument = await this.customerModel
      .find({ status: status })
      .countDocuments();
    const page = parseInt(pagination.page) ?? 1;
    const limit = parseInt(pagination.limit) ?? countDocument;
    const totalPage = Math.ceil(countDocument / limit);
    const skip = limit * (page - 1);
    const listAdvise = await this.customerModel
      .find({ status: status })
      .limit(limit)
      .skip(skip);
    if (!listAdvise) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    let data = [];
    listAdvise.map((item, index) => {
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

  async changeStatus(_id: string, status: number): Promise<any> {
    const adviseInfo = await this.customerModel.findByIdAndUpdate(_id, {
      status: status,
    });
  }
  async findCustomerByPhone(phone: string): Promise<CustomerDocument> {
    return await this.customerModel.findOne({ phone: phone });
  }

  async findCustomerById(_id: string): Promise<CustomerDocument> {
    return await this.customerModel.findById(_id);
  }

  async getAdviseInfo(_id: string): Promise<any> {
    const info = await this.customerModel.findById(_id);
    const data = {
      customer_id: info._id,
      phone: info.phone,
      name: info.name,
      address: info.address,
      email: info.email,
      status: info.status,
      level: info.level,
      destination: info.destination,
      question: info.question,
    };
    return data;
  }

  async changeStatusCustomer(_id : string, status: number):Promise<any>{
    const adviseInfo = await this.customerModel.findByIdAndUpdate(_id, {
      status: status,
    });
    if(!adviseInfo){
      return {
        status: 0,
        message: 'Cập nhật thất bại'
      }
    }
    return {
      status: 1,
      message: 'Cập nhật thành công'
    }
  }
}
