import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Offer_letterFile,
  Offer_letterFile_Schema,
  VisaFile,
  VisaFile_Schema,
} from './file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offer_letterFile.name, schema: Offer_letterFile_Schema },
    ]),
    MongooseModule.forFeature([
      { name: VisaFile.name, schema: VisaFile_Schema },
    ]),
  ],
  controllers: [],
  exports: [],
})
export class FileModule {}
