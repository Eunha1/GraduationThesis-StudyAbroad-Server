import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Offer_letterDocument = HydratedDocument<Offer_letter>;

@Schema()
export class Offer_letter {
  @Prop({ ref: 'Customer', required: true })
  customer_id: string;

  @Prop({ trim: true })
  offer_letter: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const Offer_letterSchema = SchemaFactory.createForClass(Offer_letter);

// Visa
export type VisaDocument = HydratedDocument<Visa>;

@Schema()
export class Visa {
  @Prop({ ref: 'Customer', required: true })
  customer_id: string;

  @Prop({ trim: true })
  visa: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const VisaSchema = SchemaFactory.createForClass(Visa);
