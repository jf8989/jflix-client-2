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
export class UserProfileComponent implements OnInit {
  user: any = {};
  userData = {
    Username: '',
    Email: '',
    Birthday: '',
    Password: '',
    PasswordConfirm: '',
  };

  isLoading = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

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
   * Load user data from localStorage
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
   * Format date string to YYYY-MM-DD for input field
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * Validates the form before submission
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
   * Updates the user profile
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
   * Deletes the user account
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
   * Navigates back to movies
   */
  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Logs the user out
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
