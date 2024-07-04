import { Module, forwardRef } from '@nestjs/common';
import {
  After_consultationSchema,
  After_consultation,
} from './consultation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerModule } from 'src/customer/customer.module';
import { TaskModule } from 'src/tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: After_consultation.name, schema: After_consultationSchema },
    ]),
    forwardRef(() => CustomerModule),
    forwardRef(() => TaskModule),
  ],
  providers: [ConsultationService, JwtService],
  controllers: [ConsultationController],
  exports: [ConsultationService],
})
export class ConsultationModule {}
