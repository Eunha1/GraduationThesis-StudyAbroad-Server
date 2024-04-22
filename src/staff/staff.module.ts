import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff_Info, Staff_InfoSchema } from './staff.schema';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Staff_Info.name, schema: Staff_InfoSchema },
    ]),
  ],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
