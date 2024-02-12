import { Module } from '@nestjs/common';
import {
  ConsultationSchema,
  After_consultationSchema,
  Consultation,
  After_consultation,
} from './consultation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Consultation.name, schema: ConsultationSchema },
    ]),
    MongooseModule.forFeature([
      { name: After_consultation.name, schema: After_consultationSchema },
    ]),
  ],
  controllers: [],
  exports: [],
})
export class ConsultationModule {}
