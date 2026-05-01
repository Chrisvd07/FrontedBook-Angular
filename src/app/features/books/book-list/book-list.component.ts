import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="fade-in-up">
      <div class="header-section">
        <div class="text-group">
          <h1>Biblioteca Digital</h1>
          <p>Explora y gestiona tu colección intelectual</p>
        </div>
        <button mat-raised-button color="primary" (click)="openBookForm()">
          <mat-icon>add</mat-icon> Crear Nuevo Registro
        </button>
      </div>

      <div class="book-grid">
        @for (book of books; track book.id) {
          <mat-card class="glass-card book-card">
            <div class="card-header">
              <div class="id-pill">ID #{{ book.id }}</div>
              <h3 class="book-title">{{ book.title }}</h3>
            </div>
            
            <mat-card-content>
              <div class="meta-row">
                <div class="meta-item">
                  <mat-icon>auto_stories</mat-icon>
                  <span>{{ book.pageCount }} Páginas</span>
                </div>
                <div class="meta-item">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ book.publishDate | date:'MMM yyyy' }}</span>
                </div>
              </div>
              <p class="excerpt">{{ book.description }}</p>
            </mat-card-content>

            <mat-card-actions class="actions">
              <button mat-button color="primary" [routerLink]="['/books', book.id]">Ver Detalles</button>
              <div class="spacer"></div>
              <button mat-icon-button (click)="openBookForm(book)" matTooltip="Editar"><mat-icon>edit_note</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteBook(book.id)" matTooltip="Eliminar"><mat-icon>delete_sweep</mat-icon></button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3.5rem; }
    h1 { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
    .text-group p { color: #64748b; font-size: 1.1rem; margin: 0.5rem 0 0 0; }
    .book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2.5rem; }
    .book-card { padding: 2rem; display: flex; flex-direction: column; height: 100%; border-radius: 16px !important; }
    .card-header { margin-bottom: 1.5rem; }
    .id-pill { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; width: fit-content; margin-bottom: 1rem; }
    .book-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.2; }
    .meta-row { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
    .meta-item { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.85rem; font-weight: 500; }
    .meta-item mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; color: #94a3b8; }
    .excerpt { color: #475569; line-height: 1.6; font-size: 1rem; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .actions { margin-top: auto; padding-top: 1rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; }
    .spacer { flex: 1; }
    button[mat-button] { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem; }
  `]
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  books: Book[] = [];
  ngOnInit(): void { this.loadBooks(); }
  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: any) => { this.books = Array.isArray(data) ? data : (data.value || []); this.cdr.detectChanges(); },
      error: () => this.snackBar.open('Error de sincronización', 'Reintentar')
    });
  }
  openBookForm(book?: Book): void {
    const dialogRef = this.dialog.open(BookFormComponent, { width: '500px', data: book, panelClass: 'premium-dialog' });
    dialogRef.afterClosed().subscribe(res => { if (res) { this.snackBar.open('Biblioteca actualizada', 'OK', { duration: 3000 }); this.loadBooks(); }});
  }
  deleteBook(id: number): void {
    if (confirm('¿Eliminar registro permanentemente?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => { this.snackBar.open('Registro eliminado', 'OK', { duration: 3000 }); this.loadBooks(); },
        error: () => this.snackBar.open('Fallo al eliminar', 'Cerrar')
      });
    }
  }
}
