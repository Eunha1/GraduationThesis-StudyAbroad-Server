import { Module } from '@nestjs/common';
import { CommissionModule } from './commission/commisstion.module';
import { ConsultationModule } from './consultation/consultation.module';
import { CustomerModule } from './customer/customer.module';
import { FileModule } from './file/file.module';
import { LocalityModule } from './locality/locality.module';
import { PostModule } from './post_info/post.module';
import { StaffModule } from './staff/staff.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { HomeManagerModule } from './home_manager/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CommissionModule,
    ConsultationModule,
    CustomerModule,
    FileModule,
    LocalityModule,
    PostModule,
    StaffModule,
    AuthModule,
    HomeManagerModule,
    MongooseModule.forRoot('mongodb+srv://phucdq0342:N66NMVpUf7sWQQ1W@studyabroad.sjsr5n9.mongodb.net/studyabroad?retryWrites=true&w=majority&appName=studyabroad'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
