import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  After_consultation,
  After_consultationDocument,
} from './consultation.schema';
import { Model } from 'mongoose';
import { newConsultation, pagination } from './consultation.dto';
import { CustomerService } from 'src/customer/customer.service';
import { TaskService } from 'src/tasks/tasks.service';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectModel(After_consultation.name)
    private readonly consultaionModel: Model<After_consultationDocument>,

    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,

    @Inject(forwardRef(() => TaskService))
    private taskService: TaskService,
  ) {}

  async createNewConsultation(
    newConsultation: newConsultation,
    staff: string,
  ): Promise<any> {
    const customer = await this.customerService.findCustomerByPhone(
      newConsultation.customer_phone,
    );
    const checkTask = await this.taskService.checkTaskById(
      customer._id.toString(),
      staff,
    );
    if (!checkTask) {
      return {
        status: 0,
        message:
          'Bạn không có nhiệm vụ hoặc chưa đồng ý nhận cho khách hàng này',
      };
    }
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
      evaluate: newConsultation.evaluate,
      status: 0,
      staff_id: staff,
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
      data: data,
    };
  }

  async getListConsultation(pagination: any, staff: string): Promise<any> {
    const countDocument = await this.consultaionModel
      .find({ staff_id: staff })
      .countDocuments();
    const page = parseInt(pagination.page) ?? 1;
    const limit = parseInt(pagination.limit) ?? countDocument;
    const skip = limit * (page - 1);
    const listConsultation = await this.consultaionModel
      .find({ staff_id: staff })
      .limit(pagination.limit)
      .skip(skip);
    const totalPage = Math.ceil(countDocument / limit);
    if (!listConsultation) {
      return {
        status: 0,
        message: 'Không có dữ liệu trong database',
      };
    }
    let data = [];
    let count = 1;
    for (let item of listConsultation) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const obj = {
        _id: item._id,
        stt: count++,
        customer_name: customer_info.name,
        customer_phone: customer_info.phone,
        customer_address: customer_info.address,
        customer_email: customer_info.email,
        school_year: item.school_year,
        school_name: item.school,
        level: item.level,
        country: item.country,
        majors: item.majors,
        note: item.note,
        finance: item.finance,
        schoolarship: item.schoolarship,
        evaluate: item.evaluate,
        status: item.status,
        school: item.school,
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
      _id: _id,
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
      finance: consultationInfo.finance,
      schoolarship: consultationInfo.schoolarship,
      evaluate: consultationInfo.evaluate,
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

  async updateConsultation(_id: string, body: any): Promise<any> {
    const consultation_info = await this.consultaionModel.findByIdAndUpdate(
      _id,
      body,
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

  async deleteConsultation(_id: string): Promise<any> {
    const data = await this.consultaionModel.findByIdAndDelete(_id);
    await this.taskService.deleteTask(_id)
    if (data) {
      return {
        status: 1,
        message: 'Xóa thông tin tư vấn thành công',
      };
    }
    return {
      status: 0,
      message: 'Xóa thông tin tư vấn thất bại',
    };
  }

  async checkConsultation(_id: string): Promise<any> {
    const info = await this.consultaionModel.findById(_id);
    if (!info) return false;
    return true;
  }

  async getConsultation(_id: string): Promise<any> {
    const info = await this.consultaionModel.findById(_id);
    const customer_info = await this.customerService.findCustomerById(
      info.customer_id,
    );
    const data = {
      customer_id: customer_info._id,
      name: customer_info.name,
      phone: customer_info.phone,
      email: customer_info.email,
      school_year: info.school_year,
      school_name: info.school,
      level: info.level,
      country: info.country,
      majors: info.majors,
      note: info.note,
      finance: info.finance,
      schoolarship: info.schoolarship,
      evaluate: info.evaluate,
      status: info.status,
    };
    return data;
  }
}
