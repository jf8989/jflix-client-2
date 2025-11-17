// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./welcome-page/welcome-page.component').then(m => m.WelcomePageComponent)
  },
  {
    path: 'movies',
    loadComponent: () => import('./movie-card/movie-card.component').then(m => m.MovieCardComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./my-favorites/my-favorites.component').then(m => m.MyFavoritesComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
];
