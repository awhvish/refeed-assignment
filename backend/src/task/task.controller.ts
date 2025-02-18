import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { TaskIdDto } from 'src/dto/task-id.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { getAllDto } from 'src/dto/get-all-task';

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
  async getAllTasks(@Body() params: getAllDto) {
    if (!params.page) {
      params.page = 1;
    }
    if (!params.limit) {
      params.limit = 6;
    }

    if (!params.search) {
      return await this.taskService.GetAllTask(params.page, params.limit);
    }
    return await this.taskService.GetAllTask(
      params.page,
      params.limit,
      params.search,
    );
  }

  @Delete('/:id')
  async deleteTaskById(@Param() params: TaskIdDto) {
    return await this.taskService.deleteTask(params.id);
  }
}
