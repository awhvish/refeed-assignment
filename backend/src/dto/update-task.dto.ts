import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/schemas/task.schema';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be Pending, InProgress, or Completed',
  })
  status?: TaskStatus;
}
