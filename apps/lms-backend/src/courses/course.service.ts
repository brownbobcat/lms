// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { User } from '../users/users.entity';
import { CreateCourseDto } from '../auth/dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    instructor: User
  ): Promise<Course> {
    const course = this.coursesRepository.create({
      ...createCourseDto,
      instructor,
    });
    return this.coursesRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({
      relations: ['instructor'],
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['instructor'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }
}
