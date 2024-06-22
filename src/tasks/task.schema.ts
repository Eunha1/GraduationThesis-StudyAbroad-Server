import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ ref: 'Staff_info', required: true })
  owner: string;

  @Prop({ ref: 'Staff_info', required: true })
  receiver: string;

  @Prop({ type: String, required: true })
  task: string;

  @Prop()
  status: number;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
