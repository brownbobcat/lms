import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Course } from '../../../../libs/types';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/course`;
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  private hasLoadedInitialData = false;
  courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      tap(courses => {
        this.coursesSubject.next(courses);
        this.hasLoadedInitialData = true;
      })
    );
  }

  getInstructorCourses(): Observable<Course[]> {
    if (this.hasLoadedInitialData) {
      return of(this.coursesSubject.getValue());
    }

    return this.http.get<Course[]>(`${this.apiUrl}/instructor/courses`).pipe(
      tap(courses => {
        this.coursesSubject.next(courses);
        this.hasLoadedInitialData = true;
      })
    );
  }

  getCurrentCourses(): Course[] {
    return this.coursesSubject.getValue();
  }

  createCourse(courseData: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, courseData).pipe(
      tap(newCourse => {
        const currentCourses = this.getCurrentCourses();
        this.coursesSubject.next([newCourse, ...currentCourses]);
      })
    );
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`).pipe(
      tap(() => {
        const currentCourses = this.getCurrentCourses();
        this.coursesSubject.next(
          currentCourses.filter(course => course.id !== courseId)
        );
      })
    );
  }
}