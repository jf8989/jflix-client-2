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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MovieViewDialogComponent } from '../movie-view-dialog/movie-view-dialog.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})

/**
 * Component responsible for displaying the list of movies.
 * Fetches movie data and user favorites using FetchApiDataService.
 * Renders movie cards with details and actions (view genre/director/synopsis, toggle favorite).
 * Provides navigation to the user profile and logout functionality.
 * Clicking on a movie image opens the MovieViewDialogComponent.
 */
export class MovieCardComponent implements OnInit {
  /**
   * An array holding the movie data fetched from the API, transformed for display.
   */
  movies: any[] = [];
  /**
   * An array holding the IDs of the user's favorite movies, loaded from localStorage.
   */
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook called upon component initialization.
   * Checks if the user is logged in (redirects to 'welcome' if not).
   * Calls `getFavorites` to load favorites from localStorage, then calls `getMovies`.
   */
  ngOnInit(): void {
    // Redirect if not logged in
    if (!localStorage.getItem('user') || !localStorage.getItem('token')) {
      this.router.navigate(['welcome']);
      return;
    }

    // First load favorites from localStorage
    this.getFavorites();

    // Then get movies
    this.getMovies();
  }

  /**
   * Fetches the list of all movies from the API using FetchApiDataService.
   * Transforms the raw API response into the structure expected by the template.
   * Populates the `movies` array.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      console.log('Original API response:', resp);

      // Transform the API response to match expected property names
      this.movies = resp.map((movie: any) => ({
        _id: movie._id,
        Title: movie.title, // Map title to Title
        Year: movie.releaseYear,
        ImagePath: movie.imageURL, // Map imageURL to ImagePath
        Description: movie.description, // Map description to Description
        Director: {
          Name: movie.director?.name || '',
          Bio: movie.director?.bio || '',
        },
        Genre:
          Array.isArray(movie.genres) && movie.genres.length > 0
            ? { Name: movie.genres[0].name, Description: '' }
            : { Name: movie.genre?.name || 'Uncategorized', Description: '' },
      }));

      console.log('Transformed movies:', this.movies);
    });
  }

  /**
   * Loads the user's favorite movie IDs from the 'user' object stored in localStorage.
   * Populates the `favorites` array.
   */
  getFavorites(): void {
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    this.favorites = userObj.FavoriteMovies || [];
    console.log('Loaded favorites from localStorage:', this.favorites);
  }

  /**
   * Checks if a given movie ID exists in the local `favorites` array.
   * Used to determine the state of the favorite icon on a movie card.
   * @param id - The ID of the movie to check.
   * @returns `true` if the movie is a favorite, `false` otherwise.
   */
  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  /**
   * Adds or removes a movie from the user's favorites.
   * Calls the appropriate FetchApiDataService method (`addFavoriteMovie` or `deleteFavoriteMovie`).
   * Updates the local `favorites` array and localStorage upon successful API response.
   * Provides user feedback via MatSnackBar.
   * @param id - The ID of the movie to add or remove.
   */
  toggleFavorite(id: string): void {
    if (this.isFavorite(id)) {
      this.fetchApiData.deleteFavoriteMovie(id).subscribe({
        next: (response) => {
          // Update localStorage with the new user data
          const userObj = JSON.parse(localStorage.getItem('user') || '{}');
          userObj.FavoriteMovies = userObj.FavoriteMovies.filter(
            (favId: string) => favId !== id
          );
          localStorage.setItem('user', JSON.stringify(userObj));

          // Update component state
          this.favorites = this.favorites.filter((favId) => favId !== id);

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
    } else {
      this.fetchApiData.addFavoriteMovie(id).subscribe({
        next: (response) => {
          // Update localStorage with the new user data
          const userObj = JSON.parse(localStorage.getItem('user') || '{}');
          if (!userObj.FavoriteMovies) {
            userObj.FavoriteMovies = [];
          }
          userObj.FavoriteMovies.push(id);
          localStorage.setItem('user', JSON.stringify(userObj));

          // Update component state
          this.favorites.push(id);

          this.snackBar.open('Movie added to favorites', 'OK', {
            duration: 2000,
          });
        },
        error: (err) => {
          console.error('Error adding favorite:', err);
          this.snackBar.open('Failed to add to favorites', 'OK', {
            duration: 2000,
          });
        },
      });
    }
  }

  /**
   * Opens the GenreDialogComponent in a dialog window to display genre details.
   * Passes the genre data associated with the selected movie.
   * @param genre - The genre object (containing Name, Description) to display.
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      data: { genre },
      width: '400px',
    });
  }

  /**
   * Opens the DirectorDialogComponent in a dialog window to display director details.
   * Passes the director data associated with the selected movie.
   * @param director - The director object (containing Name, Bio, etc.) to display.
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      data: { director },
      width: '400px',
    });
  }

  /**
   * Opens the SynopsisDialogComponent in a dialog window to display the movie's synopsis.
   * Passes the movie title and description.
   * @param title - The title of the movie.
   * @param description - The synopsis/description of the movie.
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisDialogComponent, {
      data: { title, description },
      width: '400px',
    });
  }

  /**
   * Opens the MovieViewDialogComponent to show details for the selected movie.
   * Triggered by clicking the movie image. Subscribes to dialog close events
   * to refresh the favorite status from localStorage.
   * @param movie The movie object to display.
   */
  openMovieViewDialog(movie: any): void {
    this.dialog.open(MovieViewDialogComponent, {
      data: movie, // Pass the movie data
      width: '80%', // Adjust width as needed
      maxWidth: '900px', // Max width for larger screens
      autoFocus: false, // Prevent autofocus on first element
      // panelClass: 'movie-view-dialog-panel' // Optional class for backdrop styling
    });

    // Subscribe to dialog close event to potentially refresh favorites icon state
    // This ensures the heart icon on the card updates if favorited/unfavorited in the dialog
    // Note: Requires the dialog component to potentially emit an event or pass back data on close,
    // or simply re-fetch favorites here. Simpler for now is to rely on localStorage sync.
    // We already update localStorage within the dialog's toggleFavorite method.
    // Let's ensure the card component re-reads from localStorage after dialog closes.
    this.dialog.afterAllClosed.subscribe(() => {
      console.log('Dialog closed, checking favorites again from localStorage');
      this.getFavorites(); // Re-fetch favorites from localStorage to update icons
    });
  }

  /**
   * Navigates the user to their profile page ('/profile').
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs the user out by clearing localStorage and navigating to the welcome page ('/welcome').
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
