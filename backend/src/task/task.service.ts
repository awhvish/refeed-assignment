import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDocument, Task } from 'src/schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(newTask: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(newTask);
    return await createdTask.save();
  }

  async GetAllTask(): Promise<Task[]> {
    const allTasks = await this.taskModel.find();
    return allTasks;
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
