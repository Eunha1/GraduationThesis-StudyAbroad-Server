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
    const oldAreaName = this.localityModel.findOne({
      area_name: createLocality.area_name,
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
}
