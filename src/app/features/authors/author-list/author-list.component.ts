import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/book.model';
import { AuthorFormComponent } from '../author-form/author-form.component';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="fade-in-up">
      <div class="header-section">
        <div class="text-group">
          <h1>Authors Directory</h1>
          <p>Verified contributors to our literary collection</p>
        </div>
        <button mat-raised-button color="primary" (click)="openAuthorForm()">
          <mat-icon>person_add</mat-icon> Register Author
        </button>
      </div>

      <div class="table-container glass-card">
        <table mat-table [dataSource]="authors">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> Reference </th>
            <td mat-cell *matCellDef="let author"> <span class="ref-id">REF-{{author.id}}</span> </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Contributor </th>
            <td mat-cell *matCellDef="let author"> 
              <div class="contributor-cell">
                <div class="mini-avatar">{{author.firstName[0]}}</div>
                <div class="name-box">
                  <span class="full-name">{{author.firstName}} {{author.lastName}}</span>
                  <span class="role">Official Author</span>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="booksCount">
            <th mat-header-cell *matHeaderCellDef> Publications </th>
            <td mat-cell *matCellDef="let author"> 
              <div class="pub-badge">{{author.booksCount || 0}} Published Books</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef align="end"> </th>
            <td mat-cell *matCellDef="let author" align="end">
              <button mat-icon-button class="action-btn edit" (click)="openAuthorForm(author)" matTooltip="Update Info">
                <mat-icon>edit_square</mat-icon>
              </button>
              <button mat-icon-button class="action-btn delete" (click)="deleteAuthor(author.id)" matTooltip="Remove Record">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
    h1 { font-size: 3rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -2px; }
    .text-group p { color: #64748b; font-size: 1.1rem; margin: 0.5rem 0 0 0; }

    .table-container { padding: 1rem; border-radius: 24px; overflow: hidden; background: white; border: 1px solid #e2e8f0; }
    table { width: 100%; background: transparent !important; }
    
    th { color: #94a3b8 !important; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px; font-weight: 700; padding: 1.5rem !important; border-bottom: 1px solid #f1f5f9 !important; }
    td { padding: 1.5rem !important; border-bottom: 1px solid #f8fafc !important; vertical-align: middle; }
    
    .ref-id { font-family: monospace; font-weight: 700; color: #94a3b8; font-size: 0.85rem; }
    
    .contributor-cell { display: flex; align-items: center; gap: 1rem; }
    .mini-avatar { width: 40px; height: 40px; background: #eff6ff; color: #2563eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; border: 1px solid #dbeafe; }
    .name-box { display: flex; flex-direction: column; }
    .full-name { color: #0f172a; font-weight: 700; font-size: 1rem; }
    .role { color: #94a3b8; font-size: 0.75rem; font-weight: 500; }

    .pub-badge { background: #f8fafc; color: #475569; padding: 6px 14px; border-radius: 10px; font-size: 0.8rem; font-weight: 600; border: 1px solid #e2e8f0; width: fit-content; }
    
    .action-btn { transition: all 0.2s ease; margin-left: 0.5rem; }
    .action-btn.edit:hover { color: #2563eb; background: #eff6ff; }
    .action-btn.delete:hover { color: #ef4444; background: #fef2f2; }

    tr:hover td { background: #fcfdfe; }
  `]
})
export class AuthorListComponent implements OnInit {
  private authorService = inject(AuthorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  authors: Author[] = [];
  displayedColumns: string[] = ['id', 'name', 'booksCount', 'actions'];
  ngOnInit(): void { this.loadAuthors(); }
  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (data: any) => {
        const raw = Array.isArray(data) ? data : (data.value || []);
        const authorMap = new Map<string, Author>();
        raw.forEach((item: any) => {
          const fullName = `${item.firstName} ${item.lastName}`;
          if (authorMap.has(fullName)) {
            const existing = authorMap.get(fullName)!;
            existing.booksCount = (existing.booksCount || 0) + 1;
          } else {
            authorMap.set(fullName, { ...item, booksCount: 1 });
          }
        });
        this.authors = Array.from(authorMap.values());
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('API connection failed', 'Retry')
    });
  }
  openAuthorForm(author?: Author): void {
    const dialogRef = this.dialog.open(AuthorFormComponent, { width: '400px', data: author, panelClass: 'premium-dialog' });
    dialogRef.afterClosed().subscribe(res => { if (res) { this.snackBar.open('Author directory updated', 'OK', { duration: 3000 }); this.loadAuthors(); }});
  }
  deleteAuthor(id: number): void {
    if (confirm('Permanently remove this author?')) {
      this.authorService.deleteAuthor(id).subscribe({
        next: () => { this.snackBar.open('Record removed', 'OK', { duration: 3000 }); this.loadAuthors(); },
        error: () => this.snackBar.open('Removal failed', 'Close')
      });
    }
  }
}
