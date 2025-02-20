import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskIdDto } from '../dto/task-id.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetAllDto } from '../dto/get-all-task';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() newTask: CreateTaskDto) {
    return await this.taskService.createTask(newTask);
  }

  @Put('/:id')
  async updateTask(
    @Param() params: TaskIdDto,
    @Body() updateData: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(updateData, params.id);
  }

  @Get('/:id')
  async getTaskById(@Param() params: TaskIdDto) {
    return await this.taskService.getTaskById(params.id);
  }

  @Get()
  async getAllTasks(@Query() query: GetAllDto) {
    const page = query.page || 1;
    const limit = query.limit || 6;
    const search = query.search || undefined;
    const statusFilter = query.filter || undefined;

    return await this.taskService.GetAllTask(page, limit, search, statusFilter);
  }

  @Delete('/:id')
  async deleteTaskById(@Param() params: TaskIdDto) {
    return await this.taskService.deleteTask(params.id);
  }
}
