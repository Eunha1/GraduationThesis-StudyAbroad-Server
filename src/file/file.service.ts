import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Offer_letter,
  Offer_letterDocument,
  Offer_letterFile,
  Offer_letterFile_Document,
  Visa,
  VisaDocument,
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
  offerLetterRecord,
  visaRecord,
  pagination,
} from './file.dto';
import { CustomerService } from '../customer/customer.service';
import { ConfigService } from '@nestjs/config';
import { mergeObject } from 'src/utils/mergeObject';
@Injectable()
export class FileService {
  constructor(
    @InjectModel(Offer_letterFile.name)
    private readonly offerLetterModel: Model<Offer_letterFile_Document>,

    @InjectModel(VisaFile.name)
    private readonly visaFileModel: Model<VisaFile_Document>,

    @InjectModel(Offer_letter.name)
    private readonly offerLetterRecordModel: Model<Offer_letterDocument>,

    @InjectModel(Visa.name)
    private readonly visaRecordsModel: Model<VisaDocument>,

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
      country: offerLetterInfo.country,
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
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại số điện thoại này',
      };
    }

    const data = {
      customer_id: customer._id,
      country: visaInfo.country,
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

  async getListOfferLetter(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const offerLetterInfo = await this.offerLetterModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    let data: Array<any> = [];
    let count = 1;
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
        country: item.country,
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

  async getListVisaFile(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const offerLetterInfo = await this.visaFileModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    let data: Array<any> = [];
    let count = 1;
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
        country: item.country,
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
      country: offerLetter_info.country,
      imagesList: [
        {
          name: 'certificate',
          images: offerLetter_info.certificate
            ? offerLetter_info.certificate.map((item) => web_url + '/' + item)
            : [],
        },
        {
          name: 'transcript',
          images: offerLetter_info.transcript
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
          images: offerLetter_info.ielts_certificate
            ? offerLetter_info.ielts_certificate.map(
                (item) => web_url + '/' + item,
              )
            : [],
        },
        {
          name: 'motivation_letter',
          images: offerLetter_info.motivation_letter
            ? offerLetter_info.motivation_letter.map(
                (item) => web_url + '/' + item,
              )
            : [],
        },
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
      country: visaFile_info.country,
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
            ? visaFile_info.birth_certificate.map(
                (item) => web_url + '/' + item,
              )
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
            ? visaFile_info.ielts_certificate.map(
                (item) => web_url + '/' + item,
              )
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
            ? visaFile_info.permanent_residence.map(
                (item) => web_url + '/' + item,
              )
            : [],
        },
        {
          name: 'financial_records',
          images: visaFile_info.financial_records
            ? visaFile_info.financial_records.map(
                (item) => web_url + '/' + item,
              )
            : [],
        },
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

  async uploadOfferLetter(
    files: { offer_letter?: Express.Multer.File[] },
    offerLetterRecord: offerLetterRecord,
  ): Promise<any> {
    const customer = await this.customerService.findCustomerByPhone(
      offerLetterRecord.customer_phone,
    );
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại số điện thoại này',
      };
    }
    const data = {
      customer_id: customer._id,
      offer_letter: files.offer_letter
        ? files.offer_letter.map(
            (item) => item.destination + '/' + item.filename,
          )
        : files.offer_letter,
      school: offerLetterRecord.school_name,
      country: offerLetterRecord.country,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newInfo = await new this.offerLetterRecordModel(data).save();
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

  async uploadVisa(
    files: { visa?: Express.Multer.File[] },
    visaRecord: visaRecord,
  ) {
    const customer = await this.customerService.findCustomerByPhone(
      visaRecord.customer_phone,
    );
    if (!customer) {
      return {
        status: 0,
        message: 'Không tồn tại số điện thoại này',
      };
    }
    const oldCustomer = await this.visaRecordsModel.findOne({
      customer_id: customer._id,
    });
    if (oldCustomer) {
      return {
        status: 0,
        message: 'Khách hàng đã tồn tại visa !!!',
      };
    }
    const data = {
      customer_id: customer._id,
      visa: files.visa
        ? files.visa.map((item) => item.destination + '/' + item.filename)
        : files.visa,
      country: visaRecord.country,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newInfo = await new this.visaRecordsModel(data).save();
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

  async getRecordOfferLetter(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const info = await this.offerLetterRecordModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    let data = [];
    let count = 1;
    for (let item of info) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const obj = {
        _id: item._id,
        stt: count++,
        customer_name: customer_info.name,
        customer_phone: customer_info.phone,
        customer_email: customer_info.email,
        customer_address: customer_info.address,
        school: item.school,
        country: item.country,
        updated_at: item.updated_at,
        created_at: item.created_at,
      };
      data.push(obj);
    }
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
  async getRecordVisa(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const info = await this.visaRecordsModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    let data = [];
    let count = 1;
    for (let item of info) {
      const customer_info = await this.customerService.findCustomerById(
        item.customer_id,
      );
      const obj = {
        _id: item._id,
        stt: count++,
        customer_name: customer_info.name,
        customer_phone: customer_info.phone,
        customer_email: customer_info.email,
        customer_address: customer_info.address,
        country: item.country,
        updated_at: item.updated_at,
        created_at: item.created_at,
      };
      data.push(obj);
    }
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

  async getRecordOfferLetterById(_id: string): Promise<any> {
    const info = await this.offerLetterRecordModel.findById(_id);
    if (!info) {
      return {
        status: 0,
        message: 'Không tồn tại thư mời này',
      };
    }
    const customer_info = await this.customerService.findCustomerById(
      info.customer_id,
    );
    const web_url = this.config.get('WEB_URL');
    const data = {
      customer_name: customer_info.name,
      customer_phone: customer_info.phone,
      customer_email: customer_info.email,
      customer_address: customer_info.address,
      school: info.school,
      country: info.country,
      imagesList: [
        {
          name: 'offer-letter',
          images: info.offer_letter
            ? info.offer_letter.map((item) => web_url + '/' + item)
            : [],
        },
      ],
      updated_at: info.updated_at,
      created_at: info.created_at,
    };

    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: data,
    };
  }

  async getRecordVisaById(_id: string): Promise<any> {
    const info = await this.visaRecordsModel.findById(_id);
    if (!info) {
      return {
        status: 0,
        message: 'Không tồn tại visa này',
      };
    }
    const customer_info = await this.customerService.findCustomerById(
      info.customer_id,
    );
    const web_url = this.config.get('WEB_URL');
    const data = {
      customer_name: customer_info.name,
      customer_phone: customer_info.phone,
      customer_email: customer_info.email,
      customer_address: customer_info.address,
      country: info.country,
      imagesList: [
        {
          name: 'visa',
          images: info.visa
            ? info.visa.map((item) => web_url + '/' + item)
            : [],
        },
      ],
      updated_at: info.updated_at,
      created_at: info.created_at,
    };
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: data,
    };
  }
  async deleteOfferLetterFile(_id: string): Promise<any> {
    const data = await this.offerLetterModel.findByIdAndDelete(_id);
    if (data) {
      return {
        status: 1,
        message: 'Xóa hồ sơ thành công',
      };
    }
    return {
      status: 0,
      message: 'Xóa hồ sơ thất bại',
    };
  }

  async deleteVisaFile(_id: string): Promise<any> {
    const data = await this.visaFileModel.findByIdAndDelete(_id);
    if (data) {
      return {
        status: 1,
        message: 'Xóa hồ sơ thành công',
      };
    }
    return {
      status: 0,
      message: 'Xóa hồ sơ thất bại',
    };
  }

  async deleteVisaRecord(_id: string): Promise<any> {
    const data = await this.visaRecordsModel.findByIdAndDelete(_id);
    if (data) {
      return {
        status: 1,
        message: 'Xóa hồ sơ thành công',
      };
    }
    return {
      status: 0,
      message: 'Xóa hồ sơ thất bại',
    };
  }

  async deleteOfferLetterRecord(_id: string): Promise<any> {
    const data = await this.offerLetterRecordModel.findByIdAndDelete(_id);
    if (data) {
      return {
        status: 1,
        message: 'Xóa hồ sơ thành công',
      };
    }
    return {
      status: 0,
      message: 'Xóa hồ sơ thất bại',
    };
  }

  async updateOfferLetterFile(_id: string, files: any, body: any) {
    const dataBody = {
      ...body,
    };
    const dataFiles = {
      certificate: files.certificate
        ? files.certificate.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : files.certificate,
      transcript: files.transcript
        ? files.transcript.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : files.transcript,
      citizen_identification_card: files.citizen_identification_card
        ? files.citizen_identification_card.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : files.citizen_identification_card,
      ielts_certificate: files.ielts_certificate
        ? files.ielts_certificate.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : files.ielts_certificate,
      motivation_letter: files.motivation_letter
        ? files.motivation_letter.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : files.motivation_letter,
      updated_at: new Date(),
    };
    const data = mergeObject(dataBody, dataFiles);
    await this.offerLetterModel.findByIdAndUpdate(_id, data);
    return {
      status: 1,
      message: 'Cập nhật hồ sơ thành công',
    };
  }

  async updateVisaFile(_id: string, files: any, body: any): Promise<any> {
    const dataBody = {
      ...body,
    };
    const dataFiles = {
      form: files.form
        ? files.form.map((item: any) => item.destination + '/' + item.filename)
        : [],
      CoE: files.CoE
        ? files.CoE.map((item: any) => item.destination + '/' + item.filename)
        : [],
      birth_certificate: files.birth_certificate
        ? files.birth_certificate.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : [],
      passport: files.passport
        ? files.passport.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : [],
      citizen_identification_card: files.citizen_identification_card
        ? files.citizen_identification_card.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : [],
      ielts_certificate: files.ielts_certificate
        ? files.ielts_certificate.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : [],
      offer_letter: files.offer_letter
        ? files.offer_letter.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : [],
      permanent_residence: files.permanent_residence
        ? files.permanent_residence.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : [],
      financial_records: files.financial_records
        ? files.financial_records.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : [],
      updated_at: new Date(),
    };
    const data = mergeObject(dataBody, dataFiles);
    await this.visaFileModel.findByIdAndUpdate(_id, data);
    return {
      status: 1,
      message: 'Cập nhật hồ sơ thành công',
    };
  }

  async updateRecordOfferLetter(
    _id: string,
    files: any,
    body: any,
  ): Promise<any> {
    const dataBody = {
      ...body,
    };
    const dataFiles = {
      offer_letter: files.offer_letter
        ? files.offer_letter.map(
            (item: any) => item.destination + '/' + item.filename,
          )
        : files.offer_letter,
      updated_at: new Date(),
    };
    const data = mergeObject(dataBody, dataFiles);
    await this.offerLetterRecordModel.findByIdAndUpdate(_id, data);
    return {
      status: 1,
      message: 'Cập nhật hồ sơ thành công',
    };
  }

  async updateRecordVisa(_id: string, files: any, body: any): Promise<any> {
    const dataBody = {
      ...body,
    };

    const dataFiles = {
      visa: files.visa
        ? files.visa.map((item: any) => item.destination + '/' + item.filename)
        : files.visa,
      updated_at: new Date(),
    };
    const data = mergeObject(dataBody, dataFiles);
    await this.visaRecordsModel.findByIdAndUpdate(_id, data);
    return {
      status: 1,
      message: 'Cập nhật hồ sơ thành công',
    };
  }
}
