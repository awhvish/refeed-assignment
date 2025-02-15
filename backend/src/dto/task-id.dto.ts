import { IsMongoId } from 'class-validator';

export class TaskIdDto {
  @IsMongoId({ message: 'Invalid Task Id' })
  id: string;
}
