import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/book.model';

@Component({
  selector: 'app-author-form',
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
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add New' }} Author</h2>
    <mat-dialog-content>
      <form [formGroup]="authorForm" class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>ID Book</mat-label>
          <input matInput type="number" formControlName="idBook" placeholder="Enter book ID">
          <mat-error *ngIf="authorForm.get('idBook')?.hasError('required')">Book ID is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" placeholder="Enter first name">
          <mat-error *ngIf="authorForm.get('firstName')?.hasError('required')">First name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" placeholder="Enter last name">
          <mat-error *ngIf="authorForm.get('lastName')?.hasError('required')">Last name is required</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="authorForm.invalid" (click)="onSave()">
        {{ data ? 'Update' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 1rem; }
    mat-form-field { width: 100%; }
    h2 { color: white; font-weight: 600; }
  `]
})
export class AuthorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  
  authorForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AuthorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Author
  ) {
    this.authorForm = this.fb.group({
      idBook: [0, [Validators.required, Validators.min(0)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.authorForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.authorForm.valid) {
      const authorData = this.authorForm.value;
      if (this.data) {
        this.authorService.updateAuthor(this.data.id, authorData).subscribe(() => this.dialogRef.close(true));
      } else {
        this.authorService.createAuthor(authorData).subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
