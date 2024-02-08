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
