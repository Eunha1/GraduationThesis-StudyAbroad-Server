import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Offer_letterFile_Document = HydratedDocument<Offer_letterFile>;

@Schema()
export class Offer_letterFile {
  @Prop({ ref: 'Cutomer', required: true })
  customer_id: string;

  @Prop({ trim: true })
  school: string;

  @Prop({ trim: true })
  certificate: string;

  @Prop({ trim: true })
  transcript: string;

  @Prop({ trim: true })
  Citizen_identification_card: string;

  @Prop({ trim: true })
  ielts_certificate: string;

  @Prop({ trim: true })
  motivation_letter: string;

  @Prop({ type: [{ type: String, ref: 'Staff_Info' }] })
  staff_list: string[];

  @Prop()
  status: number;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const Offer_letterFile_Schema =
  SchemaFactory.createForClass(Offer_letterFile);

// Visa

export type VisaFile_Document = HydratedDocument<VisaFile>;

@Schema()
export class VisaFile {
  @Prop({ ref: 'Customer', required: true })
  customer_id: string;

  @Prop({ trim: true })
  form: string;

  @Prop({ trim: true })
  CoE: string;

  @Prop({ trim: true })
  birth_certificate: string;

  @Prop({ trim: true })
  passport: string;

  @Prop({ trim: true })
  citizen_identification_card: string;

  @Prop({ trim: true })
  ielts_certificate: string;

  @Prop({ trim: true })
  offer_letter: string;

  @Prop({ trim: true })
  permanent_residence: string;

  @Prop({ trim: true })
  financial_records: string;

  @Prop({ type: [{ type: String, ref: 'Staff_Info' }] })
  staff_list: string[];

  @Prop()
  status: number;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const VisaFile_Schema = SchemaFactory.createForClass(VisaFile);
