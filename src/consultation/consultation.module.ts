import { Module } from '@nestjs/common';
import {
  After_consultationSchema,
  After_consultation,
} from './consultation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: After_consultation.name, schema: After_consultationSchema },
    ]),
  ],
  controllers: [],
  exports: [],
})
export class ConsultationModule {}
