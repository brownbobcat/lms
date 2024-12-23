import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { SyllabusComponent } from './syllabus/syllabus.component';
import { CourseMaterialComponent } from './course-material/course-material.component';
import { DiscussionsComponent } from './discussions/discussions.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { ProjectComponent } from './project/project.component';
import { GradesComponent } from './grades/grades.component';
import { CourseEvaluationComponent } from './course-evaluation/course-evaluation.component';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AnnouncementsComponent,
    SyllabusComponent,
    CourseMaterialComponent,
    DiscussionsComponent,
    AssignmentComponent,
    ProjectComponent,
    GradesComponent,
    CourseEvaluationComponent
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
})
export class CourseDetailsComponent implements OnInit {
  courseCode = '';
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.courseCode = this.route.snapshot.paramMap.get('id') || '';
  }
}
