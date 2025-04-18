// src/app/movie-view-dialog/movie-view-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar'; // For favorite feedback
import { FetchApiDataService } from '../fetch-api-data.service'; // For favorite logic

@Component({
  selector: 'app-movie-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './movie-view-dialog.component.html',
  styleUrls: ['./movie-view-dialog.component.scss'], // Corrected styleUrl
})

/**
 * Component responsible for displaying detailed movie information within a MatDialog.
 * Receives movie data via MAT_DIALOG_DATA injection. Allows toggling favorite status
 * for the displayed movie and provides a close button.
 */
export class MovieViewDialogComponent implements OnInit {
  /**
   * Holds the movie data object passed into the dialog via MAT_DIALOG_DATA.
   */
  movie: any; // To hold the movie data passed in
  /**
   * Tracks the favorite status of the currently displayed movie within this dialog instance.
   * Initialized by checking localStorage.
   */
  isFav: boolean = false; // To track favorite status within the dialog

  constructor(
    public dialogRef: MatDialogRef<MovieViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject movie data
    private fetchApiData: FetchApiDataService, // Inject service for favorites
    private snackBar: MatSnackBar // Inject snackbar for feedback
  ) {
    this.movie = data; // Assign injected data to local property
  }

  ngOnInit(): void {
    this.checkFavoriteStatus();
  }

  /**
   * Checks the initial favorite status of the movie by looking up its ID
   * in the FavoriteMovies array stored within the user object in localStorage.
   * Updates the `isFav` property.
   */
  checkFavoriteStatus(): void {
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const favorites = userObj.FavoriteMovies || [];
    this.isFav = favorites.includes(this.movie._id);
  }

  /**
   * Closes the dialog window using MatDialogRef.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Toggles the favorite status of the movie displayed in the dialog.
   * Calls the appropriate FetchApiDataService method, updates the local `isFav` state,
   * updates localStorage via `updateLocalStorageFavorites`, and shows feedback via MatSnackBar.
   */
  toggleFavorite(): void {
    const movieId = this.movie._id;
    if (this.isFav) {
      // Remove from favorites
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe({
        next: (response) => {
          this.updateLocalStorageFavorites(movieId, false);
          this.isFav = false;
          this.snackBar.open('Removed from Favorites', 'OK', {
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
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(movieId).subscribe({
        next: (response) => {
          this.updateLocalStorageFavorites(movieId, true);
          this.isFav = true;
          this.snackBar.open('Added to Favorites', 'OK', { duration: 2000 });
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
   * Updates the FavoriteMovies array within the user object stored in localStorage.
   * @param movieId The ID of the movie being added or removed.
   * @param add Boolean flag: true if adding, false if removing.
   * @private
   */
  private updateLocalStorageFavorites(movieId: string, add: boolean): void {
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    let favorites = userObj.FavoriteMovies || [];

    if (add) {
      if (!favorites.includes(movieId)) {
        favorites.push(movieId);
      }
    } else {
      favorites = favorites.filter((favId: string) => favId !== movieId);
    }

    userObj.FavoriteMovies = favorites;
    localStorage.setItem('user', JSON.stringify(userObj));

    // Optional: Emit an event here if MovieCardComponent needs to know immediately
    // about the change without waiting for a refresh/re-fetch.
  }

  /**
   * Helper function to format a movie rating to one decimal place.
   * Returns 'N/A' if the rating is invalid or not provided.
   * @param rating The rating value (can be number, string, or undefined).
   * @returns Formatted rating string (e.g., "7.5") or "N/A".
   */
  formatRating(rating: number | string | undefined): string {
    if (rating === undefined || rating === null || rating === '') return 'N/A';
    const numRating = Number(rating);
    return isNaN(numRating) ? 'N/A' : numRating.toFixed(1);
  }
}
