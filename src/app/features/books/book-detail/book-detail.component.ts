import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { Book, Author } from '../../../core/models/book.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="container" *ngIf="book">
      <button mat-button routerLink="/books" class="back-button">
        <mat-icon>arrow_back</mat-icon> Back to Library
      </button>

      <div class="detail-layout">
        <div class="sidebar">
          <div class="book-cover">
            <mat-icon>book</mat-icon>
            <span class="id-tag">ID: #{{ book.id }}</span>
          </div>
          
          <div class="quick-stats">
            <div class="stat">
              <mat-icon>auto_stories</mat-icon>
              <div class="stat-info">
                <span class="label">Pages</span>
                <span class="value">{{ book.pageCount }}</span>
              </div>
            </div>
            <div class="stat">
              <mat-icon>event</mat-icon>
              <div class="stat-info">
                <span class="label">Published</span>
                <span class="value">{{ book.publishDate | date:'longDate' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="main-content">
          <h1 class="title">{{ book.title }}</h1>

          <div class="section" *ngIf="relatedAuthors.length > 0">
            <h2>Related Authors</h2>
            <div class="author-grid">
              <div class="author-card" *ngFor="let author of relatedAuthors">
                <div class="avatar">{{ author.firstName[0] }}</div>
                <div class="author-info">
                  <span class="name">{{ author.firstName }} {{ author.lastName }}</span>
                  <span class="role">Author</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Excerpt</h2>
            <div class="excerpt-box">
              <p>{{ book.excerpt }}</p>
            </div>
          </div>

          <div class="section">
            <h2>Description</h2>
            <p class="description">{{ book.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; animation: fadeIn 0.5s ease-out; }
    .back-button { margin-bottom: 2rem; color: #64748b; font-weight: 600; }
    .detail-layout { display: grid; grid-template-columns: 350px 1fr; gap: 4rem; }
    
    .book-cover { height: 480px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; margin-bottom: 2rem; border: 1px solid #e2e8f0; background: white; border-radius: 12px; }
    .book-cover mat-icon { font-size: 8rem; width: 8rem; height: 8rem; opacity: 0.1; color: #2563eb; }
    .id-tag { position: absolute; bottom: 1.5rem; right: 1.5rem; background: #eff6ff; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-weight: 700; color: #2563eb; border: 1px solid #dbeafe; }
    
    .quick-stats { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; background: white; border-radius: 12px; border: 1px solid #e2e8f0; }
    .stat { display: flex; align-items: center; gap: 1rem; }
    .stat mat-icon { color: #2563eb; }
    .stat-info { display: flex; flex-direction: column; }
    .stat .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
    .stat .value { color: #0f172a; font-weight: 600; font-size: 1.1rem; }
    
    .title { font-size: 4rem; font-weight: 850; color: #0f172a; line-height: 1; letter-spacing: -2px; margin-bottom: 3rem; }
    
    .section { margin-bottom: 3rem; }
    .section h2 { color: #0f172a; font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; }
    
    .author-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
    .author-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; background: white; border: 1px solid #e2e8f0; }
    .avatar { width: 40px; height: 40px; background: #2563eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; }
    .author-info { display: flex; flex-direction: column; }
    .author-info .name { color: #0f172a; font-weight: 600; }
    .author-info .role { font-size: 0.8rem; color: #64748b; }

    .excerpt-box { padding: 2rem; border-left: 4px solid #2563eb; line-height: 1.8; color: #475569; font-style: italic; white-space: pre-line; background: white; border-radius: 0 12px 12px 0; border: 1px solid #e2e8f0; border-left-width: 4px; }
    .description { font-size: 1.15rem; line-height: 1.8; color: #475569; white-space: pre-line; }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 900px) { .detail-layout { grid-template-columns: 1fr; } .sidebar { order: 2; } .main-content { order: 1; } .title { font-size: 2.5rem; } }
  `]
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private cdr = inject(ChangeDetectorRef);
  
  book?: Book;
  relatedAuthors: Author[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      forkJoin({
        book: this.bookService.getBook(id),
        authors: this.authorService.getAuthors()
      }).subscribe({
        next: (result: any) => {
          this.book = result.book;
          const allAuthors = Array.isArray(result.authors) ? result.authors : (result.authors.value || []);
          this.relatedAuthors = allAuthors.filter((a: any) => a.idBook === id);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading book details:', err)
      });
    }
  }
}
