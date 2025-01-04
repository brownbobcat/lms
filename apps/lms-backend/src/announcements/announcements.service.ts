import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { CreateAnnouncementDto } from './create-announcement.dto';
import { UpdateAnnouncementDto } from './update-announcement.dto';
import { User } from '../users/users.entity';
import { UserRole } from '../users/users.types';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto, user: User) {
    if (!this.isInstructor(user)) {
      throw new ForbiddenException('Only instructors can create announcements');
    }

    const announcement = this.announcementsRepository.create({
      ...createAnnouncementDto,
      postedBy: user,
      course: { id: createAnnouncementDto.courseId }
    });

    return this.announcementsRepository.save(announcement);
  }

  async findByCourse(courseId: string) {
    return this.announcementsRepository.find({
      where: { course: { id: courseId } },
      relations: ['postedBy'],
      order: { datePosted: 'DESC' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.announcementsRepository.findOne({
      where: { id },
      relations: ['postedBy'],
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async findAll() {
    const announcements = await this.announcementsRepository.find({
      relations: ['postedBy'],
      order: { datePosted: 'DESC' },
      select: {
        id: true,
        title: true,
        content: true,
        datePosted: true,
        postedBy: {
          id: true,
          fullName: true,
          role: true
        }
      }
    });
   
    return announcements;
   }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto, user: User) {
    const announcement = await this.findOne(id);

    if (announcement.postedBy.id !== user.id) {
      throw new ForbiddenException('You can only update your own announcements');
    }

    await this.announcementsRepository.update(id, updateAnnouncementDto);
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    const announcement = await this.findOne(id);

    if (announcement.postedBy.id !== user.id) {
      throw new ForbiddenException('You can only delete your own announcements');
    }

    await this.announcementsRepository.delete(id);
  }

  private isInstructor(user: User): boolean {
    return user.role === UserRole.INSTRUCTOR;
  }
}
