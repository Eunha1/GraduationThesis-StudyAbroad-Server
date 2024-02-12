import { Module } from '@nestjs/common';
import { CommissionModule } from './commission/commisstion.module';
import { ConsultationModule } from './consultation/consultation.module';
import { CustomerModule } from './customer/customer.module';
import { FileModule } from './file/file.module';
import { LocalityModule } from './locality/locality.module';
import { PostModule } from './post_info/post.module';
import { RecordModule } from './records/records.module';
import { StaffModule } from './staff/staff.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CommissionModule,
    ConsultationModule,
    CustomerModule,
    FileModule,
    LocalityModule,
    PostModule,
    RecordModule,
    StaffModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/studyabroad'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
