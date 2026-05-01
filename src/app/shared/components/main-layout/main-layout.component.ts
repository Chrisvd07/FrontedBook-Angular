import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav mode="side" opened class="app-sidebar">
        <!-- Brand -->
        <div class="brand">
          <div class="brand-icon">
            <mat-icon>auto_stories</mat-icon>
          </div>
          <div class="brand-name">
            <span class="nexus-text">Nexus</span>
            <span class="lib-text">Biblioteca</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="navigation">
          <div class="nav-group">
            <span class="nav-label">Menú Principal</span>
            <div class="nav-items">
              <a routerLink="/books" routerLinkActive="active" class="nav-link">
                <mat-icon>grid_view</mat-icon>
                <span>Catálogo de Libros</span>
              </a>
              <a routerLink="/authors" routerLinkActive="active" class="nav-link">
                <mat-icon>people_outline</mat-icon>
                <span>Directorio de Autores</span>
              </a>
            </div>
          </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <div class="status-box">
            <div class="dot"></div>
            <span>Sistema en Línea</span>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="app-content">
        <mat-toolbar class="header">
          <div class="breadcrumb">
            <span class="bc-parent">Nexus</span>
            <mat-icon>chevron_right</mat-icon>
            <span class="bc-current">Gestión</span>
          </div>
          <span class="spacer"></span>
          <div class="header-date">
            {{ today | date:'EEEE, d ' + 'MMMM' }}
          </div>
        </mat-toolbar>
        
        <main class="page-container">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-container { height: 100vh; background: #fcfdfe; }
    .app-sidebar { width: 280px; background: white; border-right: 1px solid #f1f5f9; display: flex; flex-direction: column; padding: 2.5rem 1.5rem; }
    .brand { display: flex; align-items: center; gap: 1rem; margin-bottom: 3.5rem; padding: 0 0.5rem; }
    .brand-icon { width: 44px; height: 44px; background: #2563eb; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .brand-name { display: flex; flex-direction: column; line-height: 1.1; }
    .nexus-text { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .lib-text { font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .navigation { flex: 1; }
    .nav-group { margin-bottom: 2rem; }
    .nav-label { font-size: 0.7rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 1.25rem; padding-left: 0.75rem; }
    .nav-items { display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-link { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 12px; transition: all 0.2s ease; }
    .nav-link mat-icon { font-size: 1.4rem; width: 1.4rem; height: 1.4rem; color: #94a3b8; }
    .nav-link:hover { background: #f8fafc; color: #0f172a; }
    .nav-link.active { background: #eff6ff; color: #2563eb; }
    .nav-link.active mat-icon { color: #2563eb; }
    .sidebar-footer { margin-top: auto; padding: 1rem 0.5rem; }
    .status-box { display: flex; align-items: center; gap: 0.6rem; color: #64748b; font-size: 0.85rem; font-weight: 600; padding: 0.75rem 1rem; background: #f8fafc; border-radius: 10px; }
    .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
    .header { background: white !important; border-bottom: 1px solid #f1f5f9; height: 75px; padding: 0 2.5rem; }
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
    .bc-parent { color: #94a3b8; }
    .bc-current { color: #0f172a; font-weight: 700; }
    .header mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
    .header-date { font-size: 0.85rem; color: #64748b; font-weight: 500; text-transform: capitalize; }
    .spacer { flex: 1; }
    .page-container { padding: 3rem; min-height: calc(100vh - 75px); }
  `]
})
export class MainLayoutComponent {
  today = new Date();
}
