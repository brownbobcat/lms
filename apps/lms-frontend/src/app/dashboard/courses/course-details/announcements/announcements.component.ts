import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Announcement, UserRole } from '../../../../../../libs/types';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AnnouncementsService } from './announcements.service';
import { AuthService } from '../../../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  isInstructor = false;
  showCreateForm = false;
  courseId = '';
  newAnnouncement = {
    title: '',
    content: '',
    courseId: '', 
  };

  constructor(
    private authService: AuthService,
    private announcementsService: AnnouncementsService,
    private route: ActivatedRoute,
  ) {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.newAnnouncement.courseId = this.courseId;
  }

  ngOnInit() {
    this.isInstructor = this.authService.user()?.role === UserRole.INSTRUCTOR;
    this.loadAnnouncements();
    console.log('user role', this.authService.user()?.role)
    console.log('Instructor', this.isInstructor)
  }

  async loadAnnouncements() {
    try {
      this.announcements = await this.announcementsService.getAnnouncements();
      console.log('announcements', this.announcements)
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }

  async createAnnouncement() {
    if (!this.newAnnouncement.title || !this.newAnnouncement.content) return;

    try {
      await this.announcementsService.createAnnouncement(this.newAnnouncement);
      this.newAnnouncement = {
        title: '',
        content: '',
        courseId: this.newAnnouncement.courseId,
      };
      await this.loadAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  async deleteAnnouncement(id: string) {
    try {
      await this.announcementsService.deleteAnnouncement(id);
      await this.loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
   }
}
