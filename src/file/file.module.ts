import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Offer_letterFile,
  Offer_letterFile_Schema,
  VisaFile,
  VisaFile_Schema,
} from './file.schema';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    MongooseModule.forFeature([
      { name: Offer_letterFile.name, schema: Offer_letterFile_Schema },
    ]),
    MongooseModule.forFeature([
      { name: VisaFile.name, schema: VisaFile_Schema },
    ]),
  ],
  providers: [FileService, JwtService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
