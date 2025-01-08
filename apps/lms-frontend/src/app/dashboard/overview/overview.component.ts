import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, UserRole } from '../../../../libs/types';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from '../courses/course.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['code', 'title', 'status', 'actions'];

  dataSource!: MatTableDataSource<Course>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource<Course>([]);
  }

  ngOnInit() {
    // Check if there's existing data
    const currentCourses = this.courseService.getCurrentCourses();
    if (currentCourses.length > 0) {
      this.dataSource.data = currentCourses;
    } else {
      // If no data, fetch it
      const isInstructor = this.authService.user()?.role === UserRole.INSTRUCTOR;
      const request$ = isInstructor ? 
        this.courseService.getInstructorCourses() : 
        this.courseService.getCourses();

      request$.subscribe({
        next: (courses) => {
          this.dataSource.data = courses;
        },
        error: (error) => {
          console.error('Failed to load courses:', error);
        }
      });
    }

    // Subscribe to future updates
    this.courseService.courses$.subscribe(courses => {
      this.dataSource.data = courses;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
