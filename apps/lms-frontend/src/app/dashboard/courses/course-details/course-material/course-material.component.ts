import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CourseMaterial } from '../../../../../../libs/types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FilterByFolderPipe } from '../../../../pipes/filterByFolder';

@Component({
  selector: 'app-course-material',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FilterByFolderPipe
  ],
  templateUrl: './course-material.component.html',
  styleUrl: './course-material.component.scss',
})
export class CourseMaterialComponent {
  materials: CourseMaterial[] = [];
  folders: string[] = ['Lectures', 'Assignments', 'Resources', 'Other'];
  uploadForm: FormGroup | undefined;
  selectedFile: File | null = null;

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      folder: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.uploadForm?.patchValue({ file: file });
  }

  async onSubmit(): Promise<void> {
    if (this.uploadForm?.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('data', JSON.stringify(this.uploadForm.value));

      try {
        // Implement your upload logic here
        // await this.materialService.uploadMaterial(formData);
        this.snackBar.open('Material uploaded successfully!', 'Close', {
          duration: 3000,
        });
        this.uploadForm.reset();
        this.selectedFile = null;
      } catch (error) {
        this.snackBar.open('Error uploading material', 'Close', {
          duration: 3000,
        });
      }
    }
  }

  downloadMaterial(material: CourseMaterial): void {
    // Implement download logic
    window.open(material.fileUrl, '_blank');
  }

  getMaterialIcon(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'ppt':
      case 'pptx':
        return 'slideshow';
      default:
        return 'insert_drive_file';
    }
  }
}
