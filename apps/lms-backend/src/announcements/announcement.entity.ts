import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Course } from '../courses/course.entity';
import { User } from '../users/users.entity';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  datePosted: Date;

  @ManyToOne(() => User, { eager: true })
  postedBy: User;

  @ManyToOne(() => Course, course => course.announcements)
  course: Course;
}