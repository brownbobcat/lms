import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card'; 
import {MatListModule} from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { Course, UserRole } from '../../../../libs/types';
import { Router } from '@angular/router';
import { CourseService } from './course.service';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CoursesComponent implements OnInit {
  searchControl = new FormControl('');
  semesterControl = new FormControl('all');
  viewControl = new FormControl('grid');
  courses: Course[] = [];
  loading = false;
  error: string | null = null;
  isInstructor = false;
  showCreateForm = false;

  courseForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    code: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(20)]),
    thumbnail: new FormControl(''),
  });

  router = inject(Router)
  courseService = inject(CourseService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.isInstructor = this.authService.user()?.role === UserRole.INSTRUCTOR;
    this.loading = true;
    const request$ = this.isInstructor ? 
      this.courseService.getInstructorCourses() : 
      this.courseService.getCourses();

    request$.subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load courses';
        this.loading = false;
      }
    });
    
    // Add search filter
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(searchTerm => {
      if (!searchTerm) return;
      this.filterCourses(searchTerm);
    });
  }

  createCourse(): void {
    if (this.courseForm.valid) {
      const courseData = {
        title: this.courseForm.get('title')?.value || '',
        code: this.courseForm.get('code')?.value || '',
        description: this.courseForm.get('description')?.value || '',
        thumbnail: this.courseForm.get('thumbnail')?.value || ''
      };
      
      this.loading = true;
      this.courseService.createCourse(courseData).subscribe({
        next: (course) => {
          this.courses = [course, ...this.courses];
          this.courseForm.reset();
          this.loading = false;
          this.showCreateForm = false;
        },
        error: (err) => {
          this.error = 'Failed to create course';
          this.loading = false;
        }
      });
    }
  }

  private filterCourses(searchTerm: string): void {
    // Implement search logic
  }

  toggleFavorite(course: Course): void {
    course.isFavorite = !course.isFavorite;
  }

  goToCourse(courseCode: string): void {
    this.router.navigate(['/dashboard/courses', courseCode]);
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.courseForm.reset();
    }
  }
}
