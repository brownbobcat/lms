import { IsNotEmpty, IsString, IsEnum, IsOptional, MinLength, IsUrl } from 'class-validator';
import { CourseStatus } from '../../courses/course.type';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  code: string;

  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus = CourseStatus.DRAFT;
}
