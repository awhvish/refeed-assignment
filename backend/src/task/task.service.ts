import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDocument, Task } from '../schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(newTask: CreateTaskDto): Promise<Task> {
    return await this.taskModel.create(newTask);
  }

  async GetAllTask(
    page: number = 1,
    limit: number = 6,
    search?: string,
  ): Promise<{ tasks: Task[]; total: number }> {
    const filter: { title?: { $regex: string; $options: string } } = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const tasksPromise = this.taskModel.find(filter).skip(skip).limit(limit);
    const countPromise = this.taskModel.countDocuments(filter);

    const [tasks, total] = await Promise.all([tasksPromise, countPromise]);

    return { tasks, total };
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(updateData: UpdateTaskDto, id: string): Promise<Task> {
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
      },
    );
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async deleteTask(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid Task Id');
    }
    const deletedTask = await this.taskModel.findByIdAndDelete(id);
    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }
    return deletedTask;
  }
}
