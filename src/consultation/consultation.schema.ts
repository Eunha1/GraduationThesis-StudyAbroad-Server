import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// information after consultation

export type After_consultationDocument = HydratedDocument<After_consultation>;

@Schema()
export class After_consultation {
  @Prop({ ref: 'Customer', required: true })
  customer_id: string;

  @Prop({ trim: true })
  school_year: string;

  @Prop({ trim: true })
  level: string;

  @Prop({ trim: true })
  country: string;

  @Prop({ trim: true })
  school: string;

  @Prop({ trim: true })
  majors: string;

  @Prop({ trim: true })
  finance: string;

  @Prop({ trim: true })
  schoolarship: string;

  @Prop()
  evaluate: number;

  @Prop()
  status: number;

  @Prop({ trim: true })
  note: string;

  @Prop({ ref: 'Staff_Info' })
  staff_id: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const After_consultationSchema =
  SchemaFactory.createForClass(After_consultation);
