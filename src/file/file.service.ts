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
import {
  visaInfo,
  offerLetterFile,
  offerLetterInfo,
  visaFile,
} from './file.dto';
import { CustomerService } from '../customer/customer.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FileService {
  constructor(
    @InjectModel(Offer_letterFile.name)
    private readonly offerLetterModel: Model<Offer_letterFile_Document>,

    @InjectModel(VisaFile.name)
    private readonly visaFileModel: Model<VisaFile_Document>,

    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,

    private config: ConfigService,
  ) {}

  async uploadOfferLetterFile(
    files: offerLetterFile,
    offerLetterInfo: offerLetterInfo,
  ): Promise<any> {
    const customer = await this.customerService.findCustomerByPhone(
      offerLetterInfo.customer_phone,
    );
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại số điện thoại này',
      };
    }
    const data = {
      customer_id: customer._id,
      school: offerLetterInfo.school_name,
      certificate: files.certificate
        ? files.certificate.map(
            (item) => item.destination + '/' + item.filename,
          )
        : files.certificate,
      transcript: files.transcript
        ? files.transcript.map((item) => item.destination + '/' + item.filename)
        : files.transcript,
      citizen_identification_card: files.citizen_identification_card
        ? files.citizen_identification_card.map(
            (item) => item.destination + '/' + item.filename,
          )
        : files.citizen_identification_card,
      ielts_certificate: files.ielts_certificate
        ? files.ielts_certificate.map(
            (item) => item.destination + '/' + item.filename,
          )
        : files.ielts_certificate,
      motivation_letter: files.motivation_letter
        ? files.motivation_letter.map(
            (item) => item.destination + '/' + item.filename,
          )
        : files.motivation_letter,
      status: offerLetterInfo.status,
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

  async uploadVisaFile(files: visaFile, visaInfo: visaInfo): Promise<any> {
    const customer = await this.customerService.findCustomerByPhone(
      visaInfo.customer_phone,
    );
    console.log(files)
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại số điện thoại này',
      };
    }

    const data = {
      customer_id: customer._id,
      form: files.form
        ? files.form.map((item) => item.destination + '/' + item.filename)
        : [],
      CoE: files.CoE
        ? files.CoE.map((item) => item.destination + '/' + item.filename)
        : [],
      birth_certificate: files.birth_certificate
        ? files.birth_certificate.map(
            (item) => item.destination + '/' + item.filename,
          )
        : [],
      passport: files.passport
        ? files.passport.map((item) => item.destination + '/' + item.filename)
        : [],
      citizen_identification_card: files.citizen_identification_card
        ? files.citizen_identification_card.map(
            (item) => item.destination + '/' + item.filename,
          )
        : [],
      ielts_certificate: files.ielts_certificate
        ? files.ielts_certificate.map(
            (item) => item.destination + '/' + item.filename,
          )
        : [],
      offer_letter: files.offer_letter
        ? files.offer_letter.map(
            (item) => item.destination + '/' + item.filename,
          )
        : [],
      permanent_residence: files.permanent_residence
        ? files.permanent_residence.map(
            (item) => item.destination + '/' + item.filename,
          )
        : [],
      financial_records: files.financial_records
        ? files.financial_records.map(
            (item) => item.destination + '/' + item.filename,
          )
        : [],
      status: visaInfo.status,
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
    let count = 1
    for (let item of offerLetterInfo) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const info = {
        _id: item._id,
        stt: count++,
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
    let count = 1
    for (let item of offerLetterInfo) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const info = {
        _id: item._id,
        stt: count++,
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
    const web_url = this.config.get('WEB_URL');
    const data = {
      customer_name: customer_info.name,
      customer_phone: customer_info.phone,
      customer_email: customer_info.email,
      customer_address: customer_info.address,
      customer_level: customer_info.level,
      school_name: offerLetter_info.school,
      imagesList: [
        {
          name: 'certificate',
          images: offerLetter_info.certificate
          ? offerLetter_info.certificate.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'transcript',
          images:  offerLetter_info.transcript
          ? offerLetter_info.transcript.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'citizen_identification_card',
          images: offerLetter_info.citizen_identification_card
          ? offerLetter_info.citizen_identification_card.map(
              (item) => web_url + '/' + item,
            )
          : [],
        },
        {
          name: 'ielts_certificate',
          images:  offerLetter_info.ielts_certificate
          ? offerLetter_info.ielts_certificate.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'motivation_letter',
          images: offerLetter_info.motivation_letter
          ? offerLetter_info.motivation_letter.map((item) => web_url + '/' + item)
          : [],
        }
      ],
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
    const web_url = this.config.get('WEB_URL');
    const data = {
      customer_name: customer_info.name,
      customer_phone: customer_info.phone,
      customer_email: customer_info.email,
      customer_address: customer_info.address,
      imagesList: [
        {
          name: 'form',
          images: visaFile_info.form
          ? visaFile_info.form.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'CoE',
          images: visaFile_info.CoE
          ? visaFile_info.CoE.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'birth_certificate',
          images: visaFile_info.birth_certificate
          ? visaFile_info.birth_certificate.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'passport',
          images: visaFile_info.passport
          ? visaFile_info.passport.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'citizen_identification_card',
          images: visaFile_info.citizen_identification_card
          ? visaFile_info.citizen_identification_card.map(
              (item) => web_url + '/' + item,
            )
          : [],
        },
        {
          name: 'ielts_certificate',
          images: visaFile_info.ielts_certificate
          ? visaFile_info.ielts_certificate.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'offer_letter',
          images: visaFile_info.offer_letter
          ? visaFile_info.offer_letter.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'permanent_residence',
          images: visaFile_info.permanent_residence
          ? visaFile_info.permanent_residence.map((item) => web_url + '/' + item)
          : [],
        },
        {
          name: 'financial_records',
          images: visaFile_info.financial_records
          ? visaFile_info.financial_records.map((item) => web_url + '/' + item)
          : [],
        }
      ],
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

  async updateStatusOfferLetterFile(
    _id: string,
    newStatus: number,
  ): Promise<any> {
    const updateStatus = await this.offerLetterModel.findOneAndUpdate(
      { _id: _id },
      {
        status: newStatus,
        updated_at: new Date(),
      },
    );
    if (!updateStatus) {
      return {
        status: 0,
        message: 'Cập nhật trạng thái thất bại',
      };
    }
    return {
      status: 1,
      message: 'Cập nhật trạng thái thành công',
    };
  }

  async updateStatusVisaFile(_id: string, newStatus: number): Promise<any> {
    const updateStatus = await this.visaFileModel.findOneAndUpdate(
      { _id: _id },
      {
        status: newStatus,
        updated_at: new Date(),
      },
    );
    if (!updateStatus) {
      return {
        status: 0,
        message: 'Cập nhật trạng thái thất bại',
      };
    }
    return {
      status: 1,
      message: 'Cập nhật trạng thái thành công',
    };
  }

  async uploadImage(filePath: string): Promise<any> {
    console.log(filePath);
    const data = {
      school: filePath,
    };
    const newInfo = await new this.offerLetterModel(data).save();
    console.log(newInfo);
    return {
      message: 'save success',
      data: newInfo,
    };
  }

  async getImage(id: string): Promise<any> {
    const info = await this.offerLetterModel.findById(id);
    const web_url = this.config.get('WEB_URL');
    const imageURL = web_url + '/' + info.school;
    console.log(imageURL);
    return {
      status: 1,
      message: 'success',
      data: imageURL,
    };
  }
}
