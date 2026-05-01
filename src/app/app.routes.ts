import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'books',
        loadComponent: () => import('./features/books/book-list/book-list.component').then(m => m.BookListComponent)
      },
      {
        path: 'books/:id',
        loadComponent: () => import('./features/books/book-detail/book-detail.component').then(m => m.BookDetailComponent)
      },
      {
        path: 'authors',
        loadComponent: () => import('./features/authors/author-list/author-list.component').then(m => m.AuthorListComponent)
      },
      {
        path: '',
        redirectTo: 'books',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];
