import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import {MatDividerModule} from '@angular/material/divider';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    RouterModule,
    MobileMenuComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  userName: string | undefined;
  private router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
      this.userName = this.authService.user()?.fullName;
  }

  @ViewChild(MobileMenuComponent) mobileMenu!: MobileMenuComponent;
  isSidebarOpen = true;
  isMobile = window.innerWidth <= 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.mobileMenu.openMenu();
    } else {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  logout() {
    this.authService.logout()
  }

  viewProfile() {
    this.router.navigate(['/profile']);
  }
}
