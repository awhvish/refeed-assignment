import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In-Progress',
  Completed = 'Completed',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.Pending })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
