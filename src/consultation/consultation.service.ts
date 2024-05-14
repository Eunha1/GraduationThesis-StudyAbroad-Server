import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  After_consultation,
  After_consultationDocument,
} from './consultation.schema';
import { Model } from 'mongoose';
import { newConsultation, updateConsultation } from './consultation.dto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectModel(After_consultation.name)
    private readonly consultaionModel: Model<After_consultationDocument>,

    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
  ) {}

  async createNewConsultation(newConsultation: newConsultation): Promise<any> {
    const customer = await this.customerService.findCustomerByPhone(
      newConsultation.customer_phone,
    );
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại khách hàng này',
      };
    }
    const data = {
      customer_id: customer._id,
      school_year: newConsultation.school_year,
      level: newConsultation.level,
      country: newConsultation.country,
      school: newConsultation.school,
      majors: newConsultation.majors,
      finance: newConsultation.finance,
      schoolarship: newConsultation.schoolarship,
      status: newConsultation.status,
      note: newConsultation.note,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newInfo = await new this.consultaionModel(data).save();
    if (!newInfo) {
      return {
        status: 0,
        message: 'Tạo mới không thành công',
      };
    }
    return {
      status: 1,
      message: 'Tạo mới thành công',
      data: data
    };
  }

  async getListConsultation(): Promise<any> {
    const listConsultation = await this.consultaionModel.find({});
    if (!listConsultation) {
      return {
        status: 0,
        message: 'Không có dữ liệu trong database',
      };
    }
    let data = [];
    let count = 1
    for (let item of listConsultation) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const obj = {
        _id: item._id,
        stt : count++,
        customer_name: customer_info.name,
        customer_phone: customer_info.phone,
        customer_address: customer_info.address,
        customer_email : customer_info.email,
        level: item.level,
        school: item.school,
        majors: item.majors,
      };
      data.push(obj);
    }
    if (!data) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    return {
      status: 0,
      message: 'Lấy danh sách thành công',
      data: data,
    };
  }

  async getConsultationById(_id: string): Promise<any> {
    const consultationInfo = await this.consultaionModel.findById(_id);
    if (!consultationInfo) {
      return {
        status: 0,
        message: 'Không tồn tại thông tin tư vấn này',
      };
    }
    const customer_info = await this.customerService.findCustomerById(
      consultationInfo.customer_id,
    );
    const data = {
      consultation_id: _id,
      customer_name: customer_info.name,
      customer_phone: customer_info.phone,
      customer_address: customer_info.address,
      customer_email: customer_info.email,
      school_year: consultationInfo.school_year,
      school_name: consultationInfo.school,
      level: consultationInfo.level,
      country: consultationInfo.country,
      majors: consultationInfo.majors,
      note: consultationInfo.note,
      status: consultationInfo.status,
      created_at: consultationInfo.created_at,
      updated_at: consultationInfo.updated_at,
    };

    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: data,
    };
  }

  async updateConsultation(
    _id: string,
    updateConsultation: updateConsultation,
  ): Promise<any> {
    const consultation_info = await this.consultaionModel.findByIdAndUpdate(
      _id,
      updateConsultation,
    );
    if (!consultation_info) {
      return {
        status: 0,
        message: 'Không tồn tại thông tin tư vấn này',
      };
    }

    return {
      status: 1,
      message: 'Cập nhật thành công',
      data: consultation_info,
    };
  }

  async deleteConsultation(_id: string):Promise<any>{
    const data = await this.consultaionModel.findByIdAndDelete(_id)
    if(data){
      return {
        status : 1,
        message: 'Xóa thông tin tư vấn thành công'
      }
    }
    return {
      status: 0,
      message: 'Xóa thông tin tư vấn thất bại'
    }
  }
}
