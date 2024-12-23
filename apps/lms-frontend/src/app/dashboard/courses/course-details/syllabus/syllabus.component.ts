import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyllabusDocument } from '../../../../../../libs/types';
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
import { documents } from '../../../../../../libs/constants';
import { HttpClient } from '@angular/common/http';
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
  documents: SyllabusDocument[] = [];

  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);

  selectedDocument: SyllabusDocument | null = null;
  pdfSrc: string | null = null;

  ngOnInit(): void {
    this.documents = documents;
  }

  selectDocument(document: SyllabusDocument): void {
    console.log('Selecting document:', document);
    this.selectedDocument = document;
    this.pdfSrc =
      'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  }

  onError(error: any): void {
    console.error('PDF Error:', error);
    this.snackBar.open('Error loading PDF. Please try again.', 'Close', {
      duration: 3000,
    });
  }

  onDocumentLoad(pdf: any): void {
    console.log('PDF loaded successfully:', pdf);
  }
}
