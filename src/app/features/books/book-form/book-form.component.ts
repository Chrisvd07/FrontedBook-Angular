import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add New' }} Book</h2>
    <mat-dialog-content>
      <form [formGroup]="bookForm" class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter book title">
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Page Count</mat-label>
            <input matInput type="number" formControlName="pageCount" placeholder="0">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Publish Date</mat-label>
            <input matInput type="datetime-local" formControlName="publishDate">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Excerpt</mat-label>
          <input matInput formControlName="excerpt" placeholder="Short summary...">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Full description..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="bookForm.invalid" (click)="onSave()">
        {{ data ? 'Update' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 1rem; }
    .form-row { display: flex; gap: 1rem; }
    mat-form-field { width: 100%; }
    h2 { color: white; font-weight: 600; }
  `]
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  
  bookForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      pageCount: [0, [Validators.required, Validators.min(0)]],
      excerpt: ['', Validators.required],
      publishDate: [new Date().toISOString().slice(0, 16), Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.bookForm.patchValue({
        ...this.data,
        publishDate: this.data.publishDate ? this.data.publishDate.slice(0, 16) : ''
      });
    }
  }

  onSave(): void {
    if (this.bookForm.valid) {
      const bookData = {
        ...this.bookForm.value,
        publishDate: new Date(this.bookForm.value.publishDate).toISOString()
      };
      
      if (this.data) {
        this.bookService.updateBook(this.data.id, bookData).subscribe(() => this.dialogRef.close(true));
      } else {
        this.bookService.createBook(bookData).subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
