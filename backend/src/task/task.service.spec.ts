import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskDocument, TaskStatus } from '../schemas/task.schema';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

// Define type to include Mongoose fields
type TaskWithMongooseFields = Task & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

// Mutable array to simulate database
let mockTaskArray: TaskWithMongooseFields[] = [];

const createMockTask = (
  overrides: Partial<TaskWithMongooseFields> = {},
): TaskWithMongooseFields => ({
  _id: new Types.ObjectId(),
  title: 'NEW TASK',
  description: 'TASK TASK TASK',
  status: TaskStatus.Completed,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  ...overrides,
});

const mockTaskModel = {
  create: jest.fn().mockImplementation((taskDto: CreateTaskDto) => {
    const newTask = createMockTask(taskDto);
    mockTaskArray.push(newTask);
    return Promise.resolve(newTask);
  }),

  find: jest.fn().mockImplementation(() => ({
    sort: jest.fn().mockImplementation(() => ({
      skip: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockImplementation(() => ({
          lean: jest.fn().mockResolvedValue(mockTaskArray),
        })),
      })),
    })),
  })),

  findById: jest.fn((id: string) => {
    return Promise.resolve(
      mockTaskArray.find((task) => task._id.toString() === id) || null,
    );
  }),

  findOneAndUpdate: jest.fn((query, updateDto) => {
    const taskIndex = mockTaskArray.findIndex(
      (task) => task._id.toString() === query._id,
    );
    if (taskIndex === -1) return Promise.resolve(null);

    mockTaskArray[taskIndex] = {
      ...mockTaskArray[taskIndex],
      ...updateDto,
      updatedAt: new Date(),
    };

    return Promise.resolve(mockTaskArray[taskIndex]);
  }),

  findByIdAndDelete: jest.fn((id: string) => {
    const taskIndex = mockTaskArray.findIndex(
      (task) => task._id.toString() === id,
    );
    if (taskIndex === -1) return Promise.resolve(null);

    return Promise.resolve(mockTaskArray.splice(taskIndex, 1)[0]);
  }),

  countDocuments: jest.fn(() => Promise.resolve(mockTaskArray.length)),

  new: jest.fn().mockImplementation((taskDto: CreateTaskDto) => ({
    ...createMockTask(taskDto),
    save: jest.fn().mockResolvedValue(createMockTask(taskDto)),
  })),
};

describe('TaskService', () => {
  let service: TaskService;
  let model: Model<TaskDocument>;

  beforeEach(async () => {
    mockTaskArray = []; // Reset mock database before each test

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    model = module.get<Model<TaskDocument>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const newTask: CreateTaskDto = {
        title: 'NEW TASK',
        description: 'TASK TASK TASK',
        status: TaskStatus.Completed,
      };

      const result = await service.createTask(newTask);
      expect(result).toMatchObject(newTask);
      expect(result).toHaveProperty('_id');
      expect(mockTaskArray.length).toBe(1); // Ensure it was added to the mock DB
    });
  });

  describe('GetAllTask', () => {
    it('should return all tasks with pagination', async () => {
      const task1 = createMockTask({ title: 'Task 1' });
      const task2 = createMockTask({ title: 'Task 2' });
      mockTaskArray.push(task1, task2);

      const result = await service.GetAllTask(1, 6);
      expect(result).toEqual({
        tasks: mockTaskArray,
        total: mockTaskArray.length,
      });
    });

    it('should filter tasks with search parameter', async () => {
      const task1 = createMockTask({ title: 'Task 1' });
      const task2 = createMockTask({ title: 'Another Task' });
      mockTaskArray.push(task1, task2);

      await service.GetAllTask(1, 6, 'Task 1');
      expect(mockTaskModel.find).toHaveBeenCalledWith({
        title: { $regex: 'Task 1', $options: 'i' },
      });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const task = createMockTask();
      mockTaskArray.push(task);

      const result = await service.getTaskById(task._id.toString());
      expect(result).toMatchObject(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      await expect(
        service.getTaskById(new Types.ObjectId().toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const task = createMockTask();
      mockTaskArray.push(task);

      const updateTaskDto: UpdateTaskDto = { title: 'UPDATED TASK' };
      const result = await service.updateTask(
        updateTaskDto,
        task._id.toString(),
      );

      expect(result.title).toBe('UPDATED TASK');
    });

    it('should throw NotFoundException if task not found', async () => {
      await expect(
        service.updateTask({}, new Types.ObjectId().toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const task = createMockTask();
      mockTaskArray.push(task);

      const result = await service.deleteTask(task._id.toString());
      expect(result).toMatchObject(task);
      expect(mockTaskArray.length).toBe(0); // Ensure it was removed
    });

    it('should throw NotFoundException if task not found', async () => {
      await expect(
        service.deleteTask(new Types.ObjectId().toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if task ID is invalid', async () => {
      await expect(service.deleteTask('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
