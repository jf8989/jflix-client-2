// src/app/my-favorites/my-favorites.component.ts
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MovieViewDialogComponent } from '../movie-view-dialog/movie-view-dialog.component';

@Component({
  selector: 'app-my-favorites',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './my-favorites.component.html',
  styleUrl: './my-favorites.component.scss',
})

/**
 * Component responsible for displaying the user's favorite movies.
 * Fetches all movies and filters to show only favorited ones.
 * Provides similar functionality to MovieCardComponent but focused on favorites.
 */
export class MyFavoritesComponent implements OnInit {
  /**
   * All movies fetched from the API
   */
  movies: any[] = [];
  /**
   * Movies that are in the user's favorites list
   */
  favoriteMovies: any[] = [];
  /**
   * Filtered favorite movies based on search term
   */
  filteredFavorites: any[] = [];
  /**
   * Search term for filtering favorite movies
   */
  searchTerm: string = '';
  /**
   * Array of favorite movie IDs from localStorage
   */
  favorites: any[] = [];
  /**
   * Loading state for fetching movies
   */
  isLoading: boolean = true;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook called upon component initialization.
   * Checks if the user is logged in, loads favorites, then fetches movies.
   */
  ngOnInit(): void {
    // Redirect if not logged in
    if (!localStorage.getItem('user') || !localStorage.getItem('token')) {
      this.router.navigate(['welcome']);
      return;
    }

    // Load favorites from localStorage
    this.getFavorites();

    // Get all movies and filter to favorites
    this.getMovies();
  }

  /**
   * Fetches all movies from the API and filters to show only favorites.
   */
  getMovies(): void {
    this.isLoading = true;
    this.fetchApiData.getAllMovies().subscribe({
      next: (resp: any) => {
        // Transform the API response
        this.movies = resp.map((movie: any) => ({
          _id: movie._id,
          Title: movie.title,
          Year: movie.releaseYear,
          ImagePath: movie.imageURL,
          Description: movie.description,
          Director: {
            Name: movie.director?.name || '',
            Bio: movie.director?.bio || '',
          },
          Genre:
            Array.isArray(movie.genres) && movie.genres.length > 0
              ? { Name: movie.genres[0].name, Description: '' }
              : { Name: movie.genre?.name || 'Uncategorized', Description: '' },
        }));

        // Filter to show only favorites
        this.updateFavoriteMovies();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
        this.isLoading = false;
        this.snackBar.open('Failed to load movies', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Updates the favoriteMovies array to include only movies in the favorites list.
   */
  updateFavoriteMovies(): void {
    this.favoriteMovies = this.movies.filter(movie =>
      this.favorites.includes(movie._id)
    );
    this.filteredFavorites = [...this.favoriteMovies];
  }

  /**
   * Filters favorite movies based on search term.
   */
  filterMovies(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredFavorites = [...this.favoriteMovies];
      return;
    }

    this.filteredFavorites = this.favoriteMovies.filter(movie =>
      movie.Title?.toLowerCase().includes(term) ||
      movie.Director?.Name?.toLowerCase().includes(term) ||
      movie.Genre?.Name?.toLowerCase().includes(term)
    );
  }

  /**
   * Loads the user's favorite movie IDs from localStorage.
   */
  getFavorites(): void {
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    this.favorites = userObj.FavoriteMovies || [];
  }

  /**
   * Checks if a movie is in the favorites list.
   */
  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  /**
   * Removes a movie from favorites and updates the display.
   */
  toggleFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe({
      next: (response) => {
        // Update localStorage
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        userObj.FavoriteMovies = userObj.FavoriteMovies.filter(
          (favId: string) => favId !== id
        );
        localStorage.setItem('user', JSON.stringify(userObj));

        // Update component state
        this.favorites = this.favorites.filter((favId) => favId !== id);
        this.updateFavoriteMovies();

        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000,
        });
      },
      error: (err) => {
        console.error('Error removing favorite:', err);
        this.snackBar.open('Failed to remove from favorites', 'OK', {
          duration: 2000,
        });
      },
    });
  }

  /**
   * Opens genre dialog.
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      data: { genre },
      width: '400px',
    });
  }

  /**
   * Opens director dialog.
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      data: { director },
      width: '400px',
    });
  }

  /**
   * Opens synopsis dialog.
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisDialogComponent, {
      data: { title, description },
      width: '400px',
    });
  }

  /**
   * Opens movie view dialog.
   */
  openMovieViewDialog(movie: any): void {
    this.dialog.open(MovieViewDialogComponent, {
      data: movie,
      width: '80%',
      maxWidth: '900px',
      autoFocus: false,
    });

    // Refresh favorites when dialog closes
    this.dialog.afterAllClosed.subscribe(() => {
      this.getFavorites();
      this.updateFavoriteMovies();
    });
  }

  /**
   * Navigates back to the main movies list.
   */
  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Navigates to the user profile page.
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
