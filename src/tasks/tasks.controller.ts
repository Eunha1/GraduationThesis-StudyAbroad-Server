import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { newTask, pagination } from './task.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('api/task')
export class TaskController {
  constructor(
    private readonly service: TaskService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createTask(@Req() req: any, @Body() newTask: newTask) {
    if (
      !newTask.receiver ||
      newTask.receiver === '' ||
      newTask.task === '' ||
      !newTask.task
    ) {
      return {
        status: 0,
        message: 'Vui lòng chọn nhiệm vụ và người nhận',
      };
    }
    return await this.service.taskForAdvise(
      req.user.sub,
      newTask.receiver,
      newTask.task,
    );
  }

  @Post('/create/for-consultation')
  @UseGuards(AuthGuard)
  async createTaskForConsultation(@Req() req: any, @Body() newTask: newTask) {
    if (
      !newTask.receiver ||
      newTask.receiver === '' ||
      newTask.task === '' ||
      !newTask.task
    ) {
      return {
        status: 0,
        message: 'Vui lòng chọn nhiệm vụ và người nhận',
      };
    }
    return await this.service.taskForConsultation(
      req.user.sub,
      newTask.receiver,
      newTask.task,
    );
  }
  @Get('/get-task')
  @UseGuards(AuthGuard)
  async getReceiverTask(@Req() req: any, @Body() pagination: pagination) {
    return await this.service.getReceivertTask(req.user.sub, pagination);
  }
  @Get('/owner-task')
  @UseGuards(AuthGuard)
  async getOwnerTask(@Req() req: any, @Body() pagination: pagination) {
    return await this.service.getOwnerTask(req.user.sub, pagination);
  }
  @Get('/owner-task-consultation')
  @UseGuards(AuthGuard)
  async getOwnerTaskConsultation(
    @Req() req: any,
    @Body() pagination: pagination,
  ) {
    return await this.service.getOwnerTaskForConsultation(
      req.user.sub,
      pagination,
    );
  }
  @Get('/task-for-consultation')
  @UseGuards(AuthGuard)
  async getReceiverTaskForConsultation(
    @Req() req: any,
    @Body() pagination: pagination,
  ) {
    return await this.service.getReceiverTaskForConsultation(
      req.user.sub,
      pagination,
    );
  }
  @Post('/confirm/:id')
  @UseGuards(AuthGuard)
  async confirmTask(
    @Param('id') id: string,
    @Query('status') status: number,
    @Req() req: any,
    @Body() body: any,
  ) {
    return await this.service.confirmTask(
      status,
      id,
      req.user.sub,
      body.adviseStatus,
    );
  }
}
