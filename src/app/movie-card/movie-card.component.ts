// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if not logged in
    if (!localStorage.getItem('user') || !localStorage.getItem('token')) {
      this.router.navigate(['welcome']);
      return;
    }

    this.getMovies();
    this.getFavorites();
  }

  /**
   * Gets all movies from the API
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
    });
  }

  /**
   * Gets user's favorite movies
   */
  getFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Call getUser with no parameter since we've modified it to handle that case
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favorites = resp.FavoriteMovies || [];
    });
  }

  /**
   * Checks if a movie is in the user's favorites
   * @param id Movie ID
   * @returns boolean
   */
  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  /**
   * Adds or removes a movie from favorites
   * @param id Movie ID
   */
  toggleFavorite(id: string): void {
    if (this.isFavorite(id)) {
      this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
        this.favorites = this.favorites.filter((fav) => fav !== id);
        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000,
        });
      });
    } else {
      this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
        this.favorites.push(id);
        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000,
        });
      });
    }
  }

  /**
   * Opens the genre dialog
   * @param genre Genre object
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      data: { genre },
      width: '400px',
    });
  }

  /**
   * Opens the director dialog
   * @param director Director object
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      data: { director },
      width: '400px',
    });
  }

  /**
   * Opens the synopsis dialog
   * @param title Movie title
   * @param description Movie description
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisDialogComponent, {
      data: { title, description },
      width: '400px',
    });
  }

  /**
   * Navigates to user profile
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs the user out
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
