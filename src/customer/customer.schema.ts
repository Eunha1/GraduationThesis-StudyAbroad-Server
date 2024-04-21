import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  email: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  level: string;

  @Prop({ trim: true })
  destination: string;

  @Prop({ trim: true })
  question: string;

  @Prop()
  status: number;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
