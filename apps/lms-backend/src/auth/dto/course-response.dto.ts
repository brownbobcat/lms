import { CourseStatus } from '../../courses/course.type';

export class CourseResponseDto {
  id: string;
  title: string;
  description: string;
  code: string;
  thumbnail?: string;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
}
