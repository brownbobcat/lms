import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  DiscussionPost,
  DiscussionComment,
} from '../../../../../../libs/types';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-discussions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
  ],
  templateUrl: './discussions.component.html',
  styleUrl: './discussions.component.scss',
})
export class DiscussionsComponent {
  posts: DiscussionPost[] = [];
  postForm!: FormGroup;
  commentForm!: FormGroup;
  selectedPost: DiscussionPost | null = null;
  replyingTo: DiscussionComment | null = null;
  uploadedFiles: File[] = [];
  timeAgo = '';
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [[]],
    });

    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  async createPost(): Promise<void> {
    if (this.postForm.valid) {
      const formData = new FormData();
      this.uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('data', JSON.stringify(this.postForm.value));

      try {
        // Implement post creation
        // await this.discussionService.createPost(formData);
        this.snackBar.open('Post created successfully!', 'Close', {
          duration: 3000,
        });
        this.postForm.reset();
        this.uploadedFiles = [];
      } catch (error) {
        this.snackBar.open('Error creating post', 'Close', { duration: 3000 });
      }
    }
  }

  async addComment(
    post: DiscussionPost,
    parentComment?: DiscussionComment
  ): Promise<void> {
    if (this.commentForm.valid) {
      try {
        const comment: Partial<DiscussionComment> = {
          content: this.commentForm.value.content,
          parentCommentId: parentComment?.id,
          // Add other necessary fields
        };
        // await this.discussionService.addComment(post.id, comment);
        this.snackBar.open('Comment added successfully!', 'Close', {
          duration: 3000,
        });
        this.commentForm.reset();
        this.replyingTo = null;
      } catch (error) {
        this.snackBar.open('Error adding comment', 'Close', { duration: 3000 });
      }
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    this.uploadedFiles.push(...files);
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  likePost(post: DiscussionPost): void {
    // Implement like functionality
  }

  likeComment(comment: DiscussionComment): void {
    // Implement like functionality
  }

  getTimeAgo(date: Date): string {
    this.timeAgo = this.getTimeAgo(date);
    return this.timeAgo;
  }

  isImage(url: string): boolean {
    // Check by file extension
    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.bmp',
      '.svg',
    ];
    const extension = url.toLowerCase().substring(url.lastIndexOf('.'));

    // Check by MIME type patterns
    const imagePatterns = ['image/', 'img/'];
    const mimeType = url.split(';')[0].split(':')[1];

    return (
      imageExtensions.includes(extension) ||
      imagePatterns.some((pattern) => mimeType?.startsWith(pattern))
    );
  }

  addTag(event: any): void {
    const value = (event.value || '').trim();
    const currentTags = this.postForm.get('tags')?.value || [];
  
    // Add tag
    if (value) {
      this.postForm.patchValue({
        tags: [...currentTags, value]
      });
    }
  
    // Clear the input value
    event.chipInput?.clear();
  }

  removeTag(tagToRemove: string): void {
    const currentTags = this.postForm.get('tags')?.value || [];
    const updatedTags = currentTags.filter((tag: string) => tag !== tagToRemove);
    
    this.postForm.patchValue({
      tags: updatedTags
    });
  }

}
