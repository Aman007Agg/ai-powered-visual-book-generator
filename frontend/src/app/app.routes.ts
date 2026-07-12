import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home')
        .then(m => m.Home)
  },

  {
    path: 'new-book',
    loadComponent: () =>
      import('./features/new-book/pages/new-book/new-book')
        .then(m => m.NewBook)
  },

  {
    path: 'page-input',
    loadComponent: () =>
      import('./features/page-input/pages/page-input/page-input')
        .then(m => m.PageInput)
  },

  {
    path: 'generating',
    loadComponent: () =>
      import('./features/generating/pages/generating/generating')
        .then(m => m.Generating)
  },

  {
    path: 'layout-preview',
    loadComponent: () =>
      import('./features/layout-preview/pages/layout-preview/layout-preview')
        .then(m => m.LayoutPreview)
  },

  {
    path: 'book-summary',
    loadComponent: () =>
      import('./features/book-summary/pages/book-summary/book-summary')
        .then(m => m.BookSummary)
  },

  {
    path: '**',
    redirectTo: ''
  }
];