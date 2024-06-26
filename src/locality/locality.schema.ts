import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocalityDocument = HydratedDocument<Locality>;

@Schema()
export class Locality {
  @Prop({ trim: true })
  area: string;

  @Prop({ trim: true })
  country: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const LocalitySchema = SchemaFactory.createForClass(Locality);
