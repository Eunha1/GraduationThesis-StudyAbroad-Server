import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Locality, LocalitySchema } from './locality.schema';
import { LocalityController } from './locality.controller';
import { LocalityService } from './locality.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Locality.name, schema: LocalitySchema },
    ]),
  ],
  providers: [LocalityService, JwtService],
  controllers: [LocalityController],
  exports: [LocalityService],
})
export class LocalityModule {}
