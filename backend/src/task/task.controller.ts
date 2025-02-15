import { Controller, Get, Post } from '@nestjs/common';
import { Task } from 'src/schemas/task.schema';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks() {
    return await this.taskService.GetAllTask();
  }

  @Post()
  async createTask(newTask: Partial<Task>): Promise<Task> {
    if (!newTask.title || !newTask.description) {
      throw new Error('Title and description are required');
    }
    return await this.taskService.createTask(newTask);
  }
}
