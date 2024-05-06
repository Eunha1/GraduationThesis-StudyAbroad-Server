import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Locality, LocalityDocument } from './locality.schema';
import { Model } from 'mongoose';
import { createLocality } from './locality.dto';

@Injectable()
export class LocalityService {
  constructor(
    @InjectModel(Locality.name)
    private readonly localityModel: Model<LocalityDocument>,
  ) {}

  async createLocality(createLocality: createLocality): Promise<any> {
    const oldAreaName = await this.localityModel.findOne({
      country: createLocality.country,
    });
    if (oldAreaName) {
      return {
        status: 0,
        message: 'Đã tồn tại quốc gia này ',
      };
    }
    const newInfo = {
      ...createLocality,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newLocality = await new this.localityModel(newInfo).save();
    if (newLocality) {
      return {
        status: 1,
        message: 'Tạo mới thành công',
      };
    } else {
      return {
        status: 0,
        message: 'Tạo mới thất bại',
      };
    }
  }

  async getDestination():Promise<any>{
    const destinationInfo = await this.localityModel.find({})
    if(!destinationInfo){
      return {
        status: 0,
        message: 'Lấy dữ liệu không thành công'
      }
    }
    return {
      status: 1,
      message: 'Lấy dữ liệu thành công',
      data: destinationInfo
    }
  }
}
