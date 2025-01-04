import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Announcement } from '../../../../../../libs/types';
import { environment } from '../../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
    private apiUrl = `${environment.apiUrl}/announcements`;
  
    constructor(private http: HttpClient) {}
  
    async getAnnouncementsByCourse(courseId: string): Promise<Announcement[]> {
      return firstValueFrom(
        this.http.get<Announcement[]>(`${this.apiUrl}/course/${courseId}`)
      );
    }
  
    async createAnnouncement(announcement: Partial<Announcement>): Promise<Announcement> {
      return firstValueFrom(this.http.post<Announcement>(this.apiUrl, announcement));
    }

    async deleteAnnouncement(id: string): Promise<void> {
        return firstValueFrom(
          this.http.delete<void>(`${this.apiUrl}/${id}`)
        );
      }
  }