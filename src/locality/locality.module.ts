import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Locality, LocalitySchema } from './locality.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Locality.name, schema: LocalitySchema },
    ]),
  ],
  controllers: [],
  exports: [],
})
export class LocalityModule {}
