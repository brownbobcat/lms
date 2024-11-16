import { IsNotEmpty, IsString, IsEnum, IsOptional, MinLength, IsUrl } from 'class-validator';
import { CourseStatus } from '../../courses/course.type';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'Thumbnail must be a valid URL' })
  thumbnail?: string;

  @IsOptional()
  @IsEnum(CourseStatus, { message: 'Invalid status. Must be draft, published, or archived' })
  status?: CourseStatus = CourseStatus.DRAFT;
}