import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Staff_InfoDocument = HydratedDocument<Staff_Info>;

@Schema()
export class Staff_Info {
  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  phone: string;

  @Prop()
  avatar: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ type: [{ type: String, ref: 'locality' }] })
  area_list: string[];

  @Prop()
  type: number;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const Staff_InfoSchema = SchemaFactory.createForClass(Staff_Info);
