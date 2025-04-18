// src/app/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})

/**
 * Component for displaying and editing the logged-in user's profile information.
 * Fetches user data initially from localStorage, allows updating email, birthday,
 * and password via FetchApiDataService. Also provides options to delete the account
 * and navigate back to the movie list or log out.
 */
export class UserProfileComponent implements OnInit {
  /**
   * Holds the complete user object, typically loaded from localStorage or API response.
   */
  user: any = {};
  /**
   * Data model bound to the profile form fields for editing.
   * Includes Username (read-only), Email, Birthday, Password (optional), and PasswordConfirm.
   */
  userData = {
    Username: '',
    Email: '',
    Birthday: '',
    Password: '',
    PasswordConfirm: '',
  };

  /**
   * Flag to indicate when an API request (update/delete) is in progress.
   * Used to disable form actions and show loading indicators.
   */
  isLoading = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook called upon component initialization.
   * Checks if the user is logged in (redirects to 'welcome' if not).
   * Calls `loadUserFromLocalStorage` to populate the form.
   */
  ngOnInit(): void {
    // Redirect if not logged in
    if (!localStorage.getItem('user') || !localStorage.getItem('token')) {
      this.router.navigate(['welcome']);
      return;
    }

    // Get user data from localStorage first
    this.loadUserFromLocalStorage();
  }

  /**
   * Loads user data from localStorage, parses it, and populates the `user`
   * and `userData` properties. Handles potential parsing errors.
   */
  loadUserFromLocalStorage(): void {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('Raw user data from localStorage:', storedUser);
        this.user = JSON.parse(storedUser);
        console.log('Parsed user object:', this.user);

        // Populate form fields from localStorage data
        this.userData.Username = this.user.Username || '';
        this.userData.Email = this.user.Email || '';
        this.userData.Birthday = this.formatDate(this.user.Birthday);

        console.log('User data loaded from localStorage');
      } else {
        console.error('No user data in localStorage');
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
  }

  /**
   * Converts a date string (potentially from API or localStorage) into
   * 'YYYY-MM-DD' format suitable for the HTML date input field.
   * @param dateString - The date string to format.
   * @returns The formatted date string or an empty string if input is invalid.
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * Performs basic validation before submitting the profile update.
   * Checks for required email and matching passwords (if a new password is entered).
   * Shows snack bar messages for validation errors.
   * @returns `true` if the form is valid, `false` otherwise.
   */
  validateForm(): boolean {
    if (!this.userData.Email) {
      this.snackBar.open('Email is required', 'OK', { duration: 2000 });
      return false;
    }

    if (
      this.userData.Password &&
      this.userData.Password !== this.userData.PasswordConfirm
    ) {
      this.snackBar.open('Passwords do not match', 'OK', { duration: 2000 });
      return false;
    }

    return true;
  }

  /**
   * Handles the submission of the profile update form.
   * Validates the form, prepares an object containing only the changed fields,
   * calls the `editUser` method of FetchApiDataService.
   * Updates localStorage and component state on success. Provides feedback via snack bar.
   */
  updateUser(): void {
    if (!this.validateForm()) {
      return;
    }

    // Create an object with only changed fields
    const updatedFields: any = {};

    if (this.userData.Email !== this.user.Email) {
      updatedFields.Email = this.userData.Email;
    }

    const currentBirthday = this.formatDate(this.user.Birthday);
    if (this.userData.Birthday && this.userData.Birthday !== currentBirthday) {
      updatedFields.Birthday = this.userData.Birthday;
    }

    if (this.userData.Password) {
      updatedFields.Password = this.userData.Password;
    }

    // Check if there are changes to update
    if (Object.keys(updatedFields).length === 0) {
      this.snackBar.open('No changes detected', 'OK', { duration: 2000 });
      return;
    }

    console.log('Updating user with data:', updatedFields);
    this.isLoading = true;

    this.fetchApiData.editUser(updatedFields).subscribe({
      next: (resp) => {
        console.log('Update response:', resp);

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(resp));

        // Update local user object
        this.user = resp;

        // Clear password fields
        this.userData.Password = '';
        this.userData.PasswordConfirm = '';

        this.snackBar.open('Profile updated successfully', 'OK', {
          duration: 2000,
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.snackBar.open('Failed to update profile', 'OK', {
          duration: 2000,
        });
        this.isLoading = false;
      },
    });
  }

  /**
   * Handles the user account deletion process.
   * Prompts the user for confirmation. If confirmed, calls the `deleteUser`
   * method of FetchApiDataService. Clears localStorage and navigates to 'welcome'
   * on success. Provides feedback via snack bar.
   */
  deleteAccount(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      this.isLoading = true;

      this.fetchApiData.deleteUser().subscribe({
        next: () => {
          localStorage.clear();
          this.snackBar.open('Account deleted successfully', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['welcome']);
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          this.snackBar.open('Failed to delete account', 'OK', {
            duration: 2000,
          });
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * Navigates the user to the main movie listing page ('/movies').
   */
  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Logs the user out by clearing localStorage and navigating to the welcome page ('/welcome').
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
