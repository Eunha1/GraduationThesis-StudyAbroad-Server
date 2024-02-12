import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommissionDocument = HydratedDocument<Commission>;

@Schema()
export class Commission {
  @Prop({ ref: 'Customer', required: true })
  customer_id: string;

  @Prop({ trim: true })
  tuition: string;

  @Prop({ trim: true })
  percentage: string;

  @Prop({ trim: true })
  note: string;

  @Prop()
  status: number;

  @Prop({ type: Date })
  expected_time: Date;

  @Prop({ type: Date })
  time_of_receipt: Date;

  @Prop({ trim: true })
  amount: string;

  @Prop({ ref: 'Staff_Info', required: true })
  staff_id: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);
