import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.schema';
import { Model } from 'mongoose';
import { StaffService } from 'src/staff/staff.service';
import { CustomerService } from 'src/customer/customer.service';
import { Role } from 'src/enum/roles.enum';
import { pagination } from './task.dto';
import { ConsultationService } from 'src/consultation/consultation.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,

    @Inject(forwardRef(() => StaffService))
    private staffService: StaffService,

    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,

    @Inject(forwardRef(() => ConsultationService))
    private consultationService: ConsultationService,
  ) {}

  async taskForAdvise(
    owner: string,
    receiver: string,
    task: string,
  ): Promise<any> {
    const checkPermission = await this.checkRolePermission(owner, receiver);
    if (!checkPermission) {
      return {
        status: 0,
        message: 'Bạn không có quyền giao nhiệm vụ này',
      };
    }
    const taskInfo = await this.customerService.findCustomerById(task);
    if (!taskInfo) {
      return {
        status: 0,
        message: 'Không tồn tại thông tin về khách hàng này',
      };
    }
    const newTask = await new this.taskModel({
      owner: owner,
      receiver: receiver,
      task: task,
      status: 1,
    }).save();
    await this.customerService.changeStatus(task, 2);
    if (!newTask) {
      return {
        status: 0,
        message: 'Giao nhiệm vụ thất bại',
      };
    }
    return {
      status: 1,
      message: 'Giao nhiệm vụ thành công',
    };
  }

  async taskForConsultation(
    owner: string,
    receiver: string,
    task: string,
  ): Promise<any> {
    const checkPermission = await this.checkRolePermission(owner, receiver);
    if (!checkPermission) {
      return {
        status: 0,
        message: 'Bạn không có quyền giao nhiệm vụ này',
      };
    }
    const taskInfo = await this.consultationService.checkConsultation(task);
    if (!taskInfo) {
      return {
        status: 0,
        message: 'Không tồn tại nhiệm vụ này',
      };
    }
    const newTask = await new this.taskModel({
      owner: owner,
      receiver: receiver,
      task: task,
      status: 1,
    }).save();
    if (!newTask) {
      return {
        status: 0,
        message: 'Giao nhiệm vụ thất bại',
      };
    }
    return {
      status: 1,
      message: 'Giao nhiệm vụ thành công',
    };
  }
  async getReceivertTask(_id: string, pagination: pagination): Promise<any> {
    const countDocument = await this.taskModel
      .find({ receiver: _id })
      .countDocuments();
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? countDocument;
    const skip = limit * (page - 1);
    const taskInfo = await this.taskModel
      .find({ receiver: _id })
      .limit(limit)
      .skip(skip);
    const totalPage = Math.ceil(countDocument / limit);
    if (!taskInfo) {
      return {
        status: 0,
        message: 'Không tồn tại nhiệm vụ này',
      };
    }
    const data = [];
    let count = 0;
    for (let item of taskInfo) {
      const obj = {
        _id: item._id,
        stt: count++,
        owner: (await this.staffService.findStaffbyId(item.owner)).email,
        receiver: (await this.staffService.findStaffbyId(item.receiver)).email,
        status: item.status,
        task: await this.customerService.getAdviseInfo(item.task),
      };
      data.push(obj);
    }
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: {
        data: data,
        paginate: {
          page: page,
          limit: limit,
          total: countDocument,
          total_page: totalPage,
        },
      },
    };
  }
  async getOwnerTask(_id: string, pagination: pagination): Promise<any> {
    const countDocument = await this.taskModel
      .find({ owner: _id })
      .countDocuments();
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? countDocument;
    const skip = limit * (page - 1);
    const taskInfo = await this.taskModel
      .find({ owner: _id })
      .limit(limit)
      .skip(skip);
    const totalPage = Math.ceil(countDocument / limit);
    if (!taskInfo) {
      return {
        status: 0,
        message: 'Không tồn tại nhiệm vụ này',
      };
    }
    const data = [];
    let count = 0;
    for (let item of taskInfo) {
      const obj = {
        _id: item._id,
        stt: count++,
        owner: (await this.staffService.findStaffbyId(item.owner)).email,
        receiver: (await this.staffService.findStaffbyId(item.receiver)).email,
        status: item.status,
        task: await this.customerService.getAdviseInfo(item.task),
      };
      data.push(obj);
    }
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: {
        data: data,
        paginate: {
          page: page,
          limit: limit,
          total: countDocument,
          total_page: totalPage,
        },
      },
    };
  }
  async getReceiverTaskForConsultation(
    _id: string,
    pagination: pagination,
  ): Promise<any> {
    const countDocument = await this.taskModel
      .find({ receiver: _id })
      .countDocuments();
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? countDocument;
    const skip = limit * (page - 1);
    const taskInfo = await this.taskModel
      .find({ receiver: _id })
      .limit(limit)
      .skip(skip);
    const totalPage = Math.ceil(countDocument / limit);
    if (!taskInfo) {
      return {
        status: 0,
        message: 'Không tồn tại nhiệm vụ này',
      };
    }
    const data = [];
    let count = 0;
    for (let item of taskInfo) {
      const obj = {
        _id: item._id,
        stt: count++,
        owner: (await this.staffService.findStaffbyId(item.owner)).email,
        receiver: (await this.staffService.findStaffbyId(item.receiver)).email,
        status: item.status,
        task: await this.consultationService.getConsultation(item.task),
      };
      data.push(obj);
    }
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: {
        data: data,
        paginate: {
          page: page,
          limit: limit,
          total: countDocument,
          total_page: totalPage,
        },
      },
    };
  }
  async getOwnerTaskForConsultation(
    _id: string,
    pagination: pagination,
  ): Promise<any> {
    const countDocument = await this.taskModel
      .find({ owner: _id })
      .countDocuments();
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? countDocument;
    const skip = limit * (page - 1);
    const taskInfo = await this.taskModel
      .find({ owner: _id })
      .limit(limit)
      .skip(skip);
    const totalPage = Math.ceil(countDocument / limit);
    if (!taskInfo) {
      return {
        status: 0,
        message: 'Không tồn tại nhiệm vụ này',
      };
    }
    const data = [];
    let count = 0;
    for (let item of taskInfo) {
      const obj = {
        _id: item._id,
        stt: count++,
        owner: (await this.staffService.findStaffbyId(item.owner)).email,
        receiver: (await this.staffService.findStaffbyId(item.receiver)).email,
        status: item.status,
        task: await this.consultationService.getConsultation(item.task),
      };
      data.push(obj);
    }
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: {
        data: data,
        paginate: {
          page: page,
          limit: limit,
          total: countDocument,
          total_page: totalPage,
        },
      },
    };
  }
  async confirmTask(
    status: number,
    _id: string,
    receiver: string,
    adviseStatus: number,
  ): Promise<any> {
    const task = await this.taskModel.findById(_id);
    if (!task) {
      return {
        status: 0,
        message: 'Không tồn tại nhiệm vụ này',
      };
    }
    if (!(task.receiver == receiver)) {
      return {
        status: 0,
        message: 'Bạn không có nhiệm vụ này',
      };
    }
    await this.taskModel.findByIdAndUpdate(_id, { status: status });
    await this.customerService.changeStatus(task.task, adviseStatus);
    return {
      status: 1,
      message: 'Cập nhật thành công',
    };
  }

  async checkRolePermission(owner: string, receiver: string): Promise<any> {
    const ownerRole = await this.staffService.getRole(owner);
    const receiverRole = await this.staffService.getRole(receiver);
    if (!ownerRole || !receiverRole) {
      return false;
    }
    if (ownerRole === receiverRole) {
      return false;
    }
    if (receiverRole === Role.ADMIN) {
      return false;
    }
    if (ownerRole === Role.ADMISSION_OFFICER) {
      return false;
    }
    return true;
  }
}
