import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConsultationDocument = HydratedDocument<Consultation>;

@Schema()
export class Consultation {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
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
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);

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
  major: string;

  @Prop()
  status: number;

  @Prop({ trim: true })
  note: string;

  @Prop({ ref: 'Staff_Info', required: true })
  staff_id: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const After_consultationSchema =
  SchemaFactory.createForClass(After_consultation);
