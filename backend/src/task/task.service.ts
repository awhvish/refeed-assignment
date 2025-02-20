import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDocument, Task } from '../schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskStatus } from '../schemas/task.schema';
@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(newTask: CreateTaskDto): Promise<Task> {
    return await this.taskModel.create(newTask);
  }

  async getTaskById(id: string): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid Task Id');
    }
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async GetAllTask(
    page: number = 1,
    limit: number = 6,
    search?: string,
    statusFilter?: string,
  ): Promise<{ tasks: Task[]; total: number }> {
    const validStatuses = {
      pending: TaskStatus.Pending,
      'in-progress': TaskStatus.InProgress,
      completed: TaskStatus.Completed,
    };

    const queryFilter: {
      title?: { $regex: string; $options: string };
      status?: TaskStatus | undefined;
    } = {};

    if (search) {
      queryFilter.title = { $regex: search, $options: 'i' };
    }

    if (statusFilter) {
      console.log('Status filter received:', statusFilter);
      const statusKey = statusFilter.toLowerCase().trim();
      console.log('Status key after normalization:', statusKey);
      console.log('Valid status keys:', Object.keys(validStatuses));

      if (statusKey in validStatuses) {
        queryFilter.status = validStatuses[statusKey] as TaskStatus;
      }
    }

    const skip = (page - 1) * limit;

    const tasks = await this.taskModel
      .find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.taskModel.countDocuments(queryFilter);

    return { tasks, total };
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
