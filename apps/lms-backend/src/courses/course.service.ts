import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { User } from '../users/users.entity';
import { CreateCourseDto } from '../auth/dto/create-course.dto';
import { CourseResponseDto } from '../auth/dto/course-response.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    instructor: User
  ): Promise<CourseResponseDto> {
    const course = this.coursesRepository.create({
      ...createCourseDto,
      instructor,
    });
    const savedCourse = await this.coursesRepository.save(course);

    return {
      id: savedCourse.id,
      title: savedCourse.title,
      description: savedCourse.description,
      code: savedCourse.code,
      thumbnail: savedCourse.thumbnail,
      status: savedCourse.status,
      createdAt: savedCourse.createdAt,
      updatedAt: savedCourse.updatedAt,
      instructor: {
        id: instructor.id,
        name: instructor.fullName,
        email: instructor.email
      }
    };
  }

  async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.coursesRepository.find({
      relations: ['instructor'],
      select: {
        instructor: {
          id: true,
          fullName: true,
          email: true
        }
      }
    });

    return courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      code: course.code,
      thumbnail: course.thumbnail,
      status: course.status,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      instructor: {
        id: course.instructor.id,
        name: course.instructor.fullName,
        email: course.instructor.email
      }
    }));
  }

  async findAllByInstructor(instructorId: string): Promise<CourseResponseDto[]> {
    const courses = await this.coursesRepository.find({
      where: { instructor: { id: instructorId } },
      relations: ['instructor'],
      select: {
        instructor: {
          id: true,
          fullName: true,
          email: true
        }
      }
    });
  
    return courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      code: course.code,
      thumbnail: course.thumbnail,
      status: course.status,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      instructor: {
        id: course.instructor.id,
        name: course.instructor.fullName,
        email: course.instructor.email
      }
    }));
  }

  async findOne(id: string): Promise<CourseResponseDto> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['instructor'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      code: course.code,
      thumbnail: course.thumbnail,
      status: course.status,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      instructor: {
        id: course.instructor.id,
        name: course.instructor.fullName,
        email: course.instructor.email
      }
    };
  }

  async delete(courseId: string, instructorId: string): Promise<void> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId, instructor: { id: instructorId } },
    });
  
    if (!course) {
      throw new NotFoundException('Course not found or you are not authorized to delete it');
    }
  
    await this.coursesRepository.remove(course);
  }
}
