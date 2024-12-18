import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsNotEmpty() 
  @IsString()
  courseDetails: string;
}
