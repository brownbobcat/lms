import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserRole } from '../users/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CourseService } from './course.service';
import { CreateCourseDto } from '../auth/dto/create-course.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('course')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return this.courseService.create(createCourseDto, req.user);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }
}