import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Announcement } from '../../../../../../libs/types';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
})
export class AnnouncementsComponent {
  announcements: Announcement[] = [
    {
      title: 'Welcome to Advanced Web Development',
      datePosted: new Date('2024-01-15T09:00:00'),
      content: `Welcome to the Advanced Web Development course! 
      
I'm excited to embark on this learning journey with all of you. Please take some time to review the course syllabus and familiarize yourself with the course requirements.

Key points to note:
- First assignment will be posted next week
- Lab sessions start from Wednesday
- Make sure to join our Discord channel for discussions`,
      postedBy: {
        name: 'Dr. Sarah Smith',
        role: 'Course Instructor',
        avatar: 'assets/instructor-avatar.png',
      },
    },
    {
      title: 'Assignment #1 Posted',
      datePosted: new Date('2024-01-18T14:30:00'),
      content:
        'The first assignment has been posted. Please check the Assignments tab. Deadline: January 25th, 11:59 PM. If you have any questions, feel free to post them in the discussion forum.',
      postedBy: {
        name: 'Mike Johnson',
        role: 'Teaching Assistant',
        avatar: 'assets/ta-avatar.png',
      },
    },
    // Add more announcements as needed
  ];
}
