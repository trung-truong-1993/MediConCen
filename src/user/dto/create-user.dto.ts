import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id1: string;

  @IsString()
  id2: string;
}