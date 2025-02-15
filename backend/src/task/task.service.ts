import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDocument, Task } from 'src/schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { TaskIdDto } from 'src/dto/task-id.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(newTask: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel({
      title: newTask.title,
      description: newTask.description,
      ...(newTask.status && { status: newTask.status }),
    });
    await createdTask.save();
    return createdTask;
  }

  async GetAllTask(): Promise<Task[]> {
    const allTasks = await this.taskModel.find();
    return allTasks;
  }

  async getTaskById(id: TaskIdDto): Promise<Task> {
    if (!Types.ObjectId.isValid(id.id)) {
      throw new NotFoundException('Invalid Task Id');
    }
    const task = await this.taskModel.findById(id.id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(updateData: UpdateTaskDto, id: TaskIdDto): Promise<Task> {
    if (!Types.ObjectId.isValid(id.id)) {
      throw new NotFoundException('Invalid Task Id');
    }
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: id.id },
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

  async deleteTask(id: TaskIdDto) {
    if (!Types.ObjectId.isValid(id.id)) {
      throw new NotFoundException('Invalid Task Id');
    }
    const deletedTask = await this.taskModel.findByIdAndDelete(id.id);
    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }
    return deletedTask;
  }
}
