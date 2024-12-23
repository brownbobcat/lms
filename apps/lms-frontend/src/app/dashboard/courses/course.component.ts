import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card'; 
import {MatListModule} from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { courses } from '../../../../libs/constants';
import { Course } from '../../../../libs/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CoursesComponent implements OnInit {
  searchControl = new FormControl('');
  semesterControl = new FormControl('all');
  viewControl = new FormControl('grid');
  courses: Course[] = [];

  router = inject(Router)

  ngOnInit(): void {
    this.courses = courses;
  }

  toggleFavorite(course: Course): void {
    course.isFavorite = !course.isFavorite;
  }

  goToCourse(courseCode: string): void {
    this.router.navigate(['/dashboard/courses', courseCode]);
  }
}
