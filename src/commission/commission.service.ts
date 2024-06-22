import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Commission, CommissionDocument } from './commission.schema';
import { Model } from 'mongoose';
import { newCommission, pagination } from './commission.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class CommissionService {
  constructor(
    @InjectModel(Commission.name)
    private readonly commissionModel: Model<CommissionDocument>,

    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
  ) {}

  async getListCommission(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const data = await this.commissionModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    if (!data) {
      return {
        status: 0,
        message: 'Lấy dữ liệu thất bại',
      };
    }
    return {
      status: 1,
      message: 'Lấy dữ liệu thành công',
      data: data,
    };
  }

  async createNewCommission(newCommission: newCommission): Promise<any> {
    const customer_info = await this.customerService.findCustomerByPhone(
      newCommission.customer_phone,
    );
    if (!customer_info) {
      return {
        status: 0,
        message: 'Không tìm thấy khách hàng với số điện thoại này',
      };
    }
    const data = {
      customer_id: customer_info._id,
      tuition: newCommission.tuition,
      percentage: newCommission.percentage,
      note: newCommission.note,
      expected_time: newCommission.expected_time,
      time_of_receipt: newCommission.time_of_receipt,
      amount: newCommission.amount,
      updated_at: new Date(),
      created_at: new Date(),
    };

    const newCommissionInfo = await new this.commissionModel(data).save();
    if (!newCommissionInfo) {
      return {
        status: 0,
        message: 'Tạo mới không thành công',
      };
    }

    return {
      status: 1,
      message: 'Tạo mới thành công',
    };
  }

  async updateStatusCommission(_id: string, newStatus: string): Promise<any> {
    const commissionInfo = await this.commissionModel.findByIdAndUpdate(_id, {
      status: newStatus,
    });
    if (!commissionInfo) {
      return {
        status: 0,
        message: 'Cập nhật thất bại',
      };
    }
    return {
      status: 1,
      message: 'Cập nhật thành công',
    };
  }
}
