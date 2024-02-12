import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff_Info, Staff_InfoSchema } from './staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Staff_Info.name, schema: Staff_InfoSchema },
    ]),
  ],
  controllers: [],
  exports: [],
})
export class StaffModule {}
