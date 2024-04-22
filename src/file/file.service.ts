import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Offer_letterFile,
  Offer_letterFile_Document,
  VisaFile,
  VisaFile_Document,
  VisaFile_Schema,
} from './file.schema';
import { Model } from 'mongoose';
import { offerLetterFile, visaFile } from './file.dto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(Offer_letterFile.name)
    private readonly offerLetterModel: Model<Offer_letterFile_Document>,

    @InjectModel(VisaFile.name)
    private readonly visaFileModel: Model<VisaFile_Document>,

    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
  ) {}

  async uploadOfferLetterFile(offerLetterFile: offerLetterFile): Promise<any> {
    const customer = await this.customerService.findCustomerByPhone(
      offerLetterFile.customer_phone,
    );
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại số điện thoại này',
      };
    }
    const data = {
      customer_id: customer._id,
      school: offerLetterFile.school_name,
      certificate: offerLetterFile.certificate,
      transcript: offerLetterFile.transcript,
      citizen_identification_card: offerLetterFile.citizen_identification_card,
      ielts_certificate: offerLetterFile.ielts_certificate,
      motivation_letter: offerLetterFile.motivation_letter,
      status: offerLetterFile.status,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newInfo = await new this.offerLetterModel(data).save();
    if (!newInfo) {
      return {
        status: 0,
        message: 'Tạo mới thất bại',
      };
    }
    return {
      status: 1,
      message: 'Tạo mới thành công',
      data: data,
    };
  }

  async uploadVisaFile(visaFile: visaFile): Promise<any> {
    const customer = await this.customerService.findCustomerByPhone(
      visaFile.customer_phone,
    );
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại số điện thoại này',
      };
    }

    const data = {
      customer_id: customer._id,
      form: visaFile.form,
      CoE: visaFile.CoE,
      birth_certificate: visaFile.birth_certificate,
      passport: visaFile.passport,
      citizen_identification_card: visaFile.citizen_identification_card,
      ielts_certificate: visaFile.ielts_certificate,
      offer_letter: visaFile.offer_letter,
      permanent_residence: visaFile.permanent_residence,
      financial_records: visaFile.financial_records,
      status: visaFile.status,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newInfo = await new this.visaFileModel(data).save();
    if (!newInfo) {
      return {
        status: 0,
        message: 'Tạo mới thất bại',
      };
    }
    return {
      status: 1,
      message: 'Tạo mới thành công',
      data: data,
    };
  }

  async getListOfferLetter(): Promise<any> {
    const offerLetterInfo = await this.offerLetterModel.find({});
    let data: Array<any> = [];
    for (let item of offerLetterInfo) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const info = {
        id: item._id,
        customer_name: customer_info.name,
        customer_phone: customer_info.phone,
        customer_email: customer_info.email,
        customer_address: customer_info.address,
        school: item.school,
        status: item.status,
      };
      data.push(info);
    }
    if (!data) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: data,
    };
  }

  async getListVisaFile(): Promise<any> {
    const offerLetterInfo = await this.visaFileModel.find({});
    let data: Array<any> = [];
    for (let item of offerLetterInfo) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const info = {
        id: item._id,
        customer_name: customer_info.name,
        customer_phone: customer_info.phone,
        customer_email: customer_info.email,
        customer_address: customer_info.address,
        status: item.status,
      };
      data.push(info);
    }
    if (!data) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: data,
    };
  }

  async getOfferLetterFileById(_id: string): Promise<any> {
    const offerLetter_info = await this.offerLetterModel.findById(_id);
    if (!offerLetter_info) {
      return {
        status: 0,
        message: 'Không tồn tại hồ sơ thư mời này',
      };
    }
    const customer_info = await this.customerService.findCustomerById(
      offerLetter_info.customer_id,
    );
    const data = {
      customer_name: customer_info.name,
      customer_phone: customer_info.phone,
      customer_email: customer_info.email,
      customer_address: customer_info.address,
      customer_level: customer_info.level,
      school_name: offerLetter_info.school,
      certificate: offerLetter_info.certificate,
      transcript: offerLetter_info.transcript,
      citizen_identification_card: offerLetter_info.Citizen_identification_card,
      ielts_certificate: offerLetter_info.ielts_certificate,
      motivation_letter: offerLetter_info.motivation_letter,
      status: offerLetter_info.status,
      updated_at: offerLetter_info.updated_at,
      created_at: offerLetter_info.created_at,
    };
    if (!data) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }

    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: data,
    };
  }
  async getVisaFileById(_id: string): Promise<any> {
    const visaFile_info = await this.visaFileModel.findById(_id);
    if (!visaFile_info) {
      return {
        status: 0,
        message: 'Không tồn tại hồ sơ visa này',
      };
    }
    const customer_info = await this.customerService.findCustomerById(
      visaFile_info.customer_id,
    );
    const data = {
      customer_name: customer_info.name,
      customer_phone: customer_info.phone,
      customer_email: customer_info.email,
      customer_address: customer_info.address,
      customer_level: customer_info.level,
      form: visaFile_info.form,
      CoE: visaFile_info.CoE,
      birth_certificate: visaFile_info.birth_certificate,
      passport: visaFile_info.passport,
      citizen_identification_card: visaFile_info.citizen_identification_card,
      ielts_certificate: visaFile_info.ielts_certificate,
      offer_letter: visaFile_info.offer_letter,
      permanent_residence: visaFile_info.permanent_residence,
      financial_records: visaFile_info.financial_records,
      status: visaFile_info.status,
      updated_at: visaFile_info.updated_at,
      created_at: visaFile_info.created_at,
    };
    if (!data) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }

    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: data,
    };
  }
}
