import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { CourseStatus } from './course.type';
import { Announcement } from '../announcements/announcement.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  code: string;

  @Column()
  thumbnail: string;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT
  })
  status: CourseStatus;

  @ManyToOne(() => User, (user) => user.coursesCreated)
  instructor: User;

  @OneToMany(() => Announcement, announcement => announcement.course)
  announcements: Announcement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
