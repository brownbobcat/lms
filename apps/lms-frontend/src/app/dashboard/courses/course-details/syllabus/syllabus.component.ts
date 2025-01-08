import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Syllabus } from '../../../../../../libs/types';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../auth/auth.service'
@Component({
  selector: 'app-syllabus',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    PdfViewerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './syllabus.component.html',
  styleUrl: './syllabus.component.scss',
})
export class SyllabusComponent implements OnInit {
  isInstructor = computed(() => {
    const user = this.authService.user();
    return user?.role === 'instructor';
  });
  documents: Syllabus[] = [];
  uploadProgress = 0;
  uploadError = '';
  isDragging = false;
  private apiUrl = `${environment.apiUrl}`;
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadDocuments();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.uploadDocument(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadDocument(file);
    }
  }

  uploadDocument(file: File) {
    if (!file.type.match(/(pdf|doc|docx)$/)) {
      this.snackBar.open('Please upload PDF or Word documents only', 'Close', {
        duration: 3000
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.uploadError = '';
    this.uploadProgress = 0;

    this.http.post(`${this.apiUrl}/syllabus/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => this.uploadProgress = 0)
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / (event.total || event.loaded)));
        } else if (event.type === HttpEventType.Response) {
          this.loadDocuments();
          this.snackBar.open('Document uploaded successfully', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.uploadError = 'Upload failed. Please try again.';
        this.snackBar.open('Upload failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  loadDocuments() {
    this.http.get<Syllabus[]>(`${this.apiUrl}/syllabus`).subscribe({
      next: (docs) => this.documents = docs,
      error: (error) => {
        this.snackBar.open('Error loading documents', 'Close', {
          duration: 3000
        });
      }
    });
  }

  downloadDocument(doc: Syllabus) {
    this.http.get(`${this.apiUrl}/syllabus/${doc.id}/download`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.name;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.snackBar.open('Download failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteDocument(doc: Syllabus) {
    this.http.delete(`${this.apiUrl}/syllabus/${doc.id}`).subscribe({
      next: () => {
        this.loadDocuments();
        this.snackBar.open('Document deleted successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Delete failed', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
