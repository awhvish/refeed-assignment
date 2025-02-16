import { TaskStatus } from '../schemas/task.schema';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be Pending, In-Progress or Completed',
  })
  status?: TaskStatus;
}
