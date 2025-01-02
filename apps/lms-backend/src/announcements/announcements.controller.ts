import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './create-announcement.dto';
import { UpdateAnnouncementDto } from './update-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/users.types';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Request() req) {
    return this.announcementsService.create(createAnnouncementDto, req.user);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.announcementsService.findByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.announcementsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @Request() req
  ) {
    return this.announcementsService.update(
      id,
      updateAnnouncementDto,
      req.user
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.announcementsService.remove(id, req.user);
  }
}
