import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CoursesComponent } from './courses/course.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { OverviewComponent } from './overview/overview.component';

export const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {
                path: 'overview',
                component: OverviewComponent
            },
            {
                path: 'courses',
                component: CoursesComponent
            },
            {
                path: 'courses/:id', 
                component: CourseDetailsComponent
            }
        ]
    }
]