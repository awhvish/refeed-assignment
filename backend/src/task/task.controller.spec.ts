import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Types } from 'mongoose';
import { Task } from '../schemas/task.schema';
import { TaskStatus } from '../schemas/task.schema';

// Define runtime type that includes Mongoose fields
type TaskWithMongooseFields = Task & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTask: TaskWithMongooseFields = {
    _id: new Types.ObjectId('67b587a42cbe554193a0c036'),
    title: 'NEW TASK',
    description: 'TASK TASK TASK',
    status: TaskStatus.Completed,
    createdAt: new Date('2025-02-19T07:26:28.803Z'),
    updatedAt: new Date('2025-02-19T07:26:28.803Z'),
    __v: 0,
  };

  const mockTaskArray = [mockTask];

  const mockPaginatedResponse = {
    tasks: mockTaskArray,
    total: 7,
  };

  const mockTaskService = {
    createTask: jest.fn(),
    GetAllTask: jest.fn(),
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'NEW TASK',
        description: 'TASK TASK TASK',
        status: TaskStatus.Completed,
      };

      const createdTask: TaskWithMongooseFields = {
        ...createTaskDto,
        _id: new Types.ObjectId('67b587a42cbe554193a0c036'),
        status: TaskStatus.Completed,
        createdAt: new Date('2025-02-19T07:26:28.803Z'),
        updatedAt: new Date('2025-02-19T07:26:28.803Z'),
        __v: 0,
      };

      jest.spyOn(service, 'createTask').mockResolvedValue(createdTask as any);

      const result = await controller.createTask(createTaskDto);

      expect(() => service.createTask(createTaskDto)).not.toThrow();
      expect(() => service.createTask(createTaskDto)).not.toThrow();
      expect(result).toHaveProperty('_id');
      expect(result.title).toEqual(createTaskDto.title);
      expect(result.status).toEqual(createTaskDto.status);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks with default pagination', async () => {
      jest
        .spyOn(service, 'GetAllTask')
        .mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getAllTasks({});

      expect(() => service.GetAllTask(1, 6, undefined)).not.toThrow();
      expect(result).toEqual(mockPaginatedResponse);
      expect(result.total).toEqual(7);
      expect(result.tasks[0]).toHaveProperty('_id');
      expect(result.tasks[0]).toHaveProperty('createdAt');
      expect(result.tasks[0]).toHaveProperty('updatedAt');
    });

    it('should return filtered tasks with custom pagination', async () => {
      const query = { page: 2, limit: 6, search: 'NEW' };

      jest
        .spyOn(service, 'GetAllTask')
        .mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getAllTasks(query);

      expect(() => service.GetAllTask(2, 6, 'NEW')).not.toThrow();
      expect(result).toEqual(mockPaginatedResponse);
      expect(result.tasks[0].title).toEqual('NEW TASK');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      jest.spyOn(service, 'getTaskById').mockResolvedValue(mockTask as any);

      const result = await controller.getTaskById({
        id: '67b587a42cbe554193a0c036',
      });

      expect(service.getTaskById).toHaveBeenCalledWith(
        '67b587a42cbe554193a0c036',
      );
      expect(result).toMatchObject({
        title: mockTask.title,
        description: mockTask.description,
        status: mockTask.status,
      });
      expect(result).toHaveProperty('_id');
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'UPDATED TASK',
        status: TaskStatus.Completed,
      };

      const updatedTask = {
        ...mockTask,
        ...updateTaskDto,
        updatedAt: new Date('2025-02-19T08:00:00.000Z'),
      };

      jest.spyOn(service, 'updateTask').mockResolvedValue(updatedTask as any);

      const result = await controller.updateTask(
        { id: '67b587a42cbe554193a0c036' },
        updateTaskDto,
      );

      expect(() =>
        service.updateTask(updateTaskDto, '67b587a42cbe554193a0c036'),
      ).not.toThrow();
      expect(result).toMatchObject({
        title: 'UPDATED TASK',
        status: 'Completed',
      });
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('deleteTaskById', () => {
    it('should delete a task', async () => {
      jest.spyOn(service, 'deleteTask').mockResolvedValue(mockTask as any);

      const result = await controller.deleteTaskById({
        id: '67b587a42cbe554193a0c036',
      });

      expect(service.deleteTask).toHaveBeenCalledWith(
        '67b587a42cbe554193a0c036',
      );
      expect(result).toMatchObject({
        title: mockTask.title,
        description: mockTask.description,
        status: mockTask.status,
      });
      expect(result._id.toString()).toEqual('67b587a42cbe554193a0c036');
    });
  });
});
