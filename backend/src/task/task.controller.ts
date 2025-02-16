import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { TaskIdDto } from 'src/dto/task-id.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

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
  async getAllTasks() {
    return await this.taskService.GetAllTask();
  }

  @Delete('/:id')
  async deleteTaskById(@Param() params: TaskIdDto) {
    return await this.taskService.deleteTask(params.id);
  }
}
