import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { TaskService } from './tasks.service';
import { JwtService } from '@nestjs/jwt';
import { TaskController } from './tasks.controller';
import { StaffModule } from 'src/staff/staff.module';
import { CustomerModule } from 'src/customer/customer.module';
import { ConsultationModule } from 'src/consultation/consultation.module';

@Module({
  imports: [
    forwardRef(() => StaffModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => ConsultationModule),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskService, JwtService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
