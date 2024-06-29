import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Offer_letter,
  Offer_letterFile,
  Offer_letterFile_Schema,
  Offer_letterSchema,
  Visa,
  VisaFile,
  VisaFile_Schema,
  VisaSchema,
} from './file.schema';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from 'src/tasks/tasks.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    forwardRef(()=> TaskModule),
    forwardRef(()=>StaffModule),
    ConfigModule,
    MongooseModule.forFeature([
      { name: Offer_letterFile.name, schema: Offer_letterFile_Schema },
    ]),
    MongooseModule.forFeature([
      { name: VisaFile.name, schema: VisaFile_Schema },
    ]),
    MongooseModule.forFeature([
      { name: Offer_letter.name, schema: Offer_letterSchema },
    ]),
    MongooseModule.forFeature([{ name: Visa.name, schema: VisaSchema }]),
  ],
  providers: [FileService, JwtService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
