import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Offer_letter,
  Offer_letterSchema,
  Visa,
  VisaSchema,
} from './records.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offer_letter.name, schema: Offer_letterSchema },
    ]),
    MongooseModule.forFeature([{ name: Visa.name, schema: VisaSchema }]),
  ],
  controllers: [],
  exports: [],
})
export class RecordModule {}
