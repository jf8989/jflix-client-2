// src/app/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
  };

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

    this.getUserInfo();
  }

  /**
   * Gets user info
   */
  getUserInfo(): void {
    // Call getUser with no parameter since we've modified it to handle that case
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.userData.Username = resp.Username;
      this.userData.Email = resp.Email;
      this.userData.Birthday = resp.Birthday
        ? new Date(resp.Birthday).toISOString().split('T')[0]
        : '';
    });
  }

  /**
   * Updates the user profile
   */
  updateUser(): void {
    // Filter out empty fields
    const updatedData: any = {};
    Object.keys(this.userData).forEach((key) => {
      if (
        this.userData[key as keyof typeof this.userData] &&
        key !== 'Birthday'
      ) {
        updatedData[key] = this.userData[key as keyof typeof this.userData];
      }
    });

    // Add formatted birthday if present
    if (this.userData.Birthday) {
      updatedData.Birthday = new Date(this.userData.Birthday).toISOString();
    }

    this.fetchApiData.editUser(updatedData).subscribe({
      next: (resp) => {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(resp));
        this.user = resp;
        this.snackBar.open('Profile updated successfully', 'OK', {
          duration: 2000,
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to update profile', 'OK', {
          duration: 2000,
        });
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
      this.fetchApiData.deleteUser().subscribe({
        next: () => {
          localStorage.clear();
          this.snackBar.open('Account deleted successfully', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['welcome']);
        },
        error: (err) => {
          this.snackBar.open('Failed to delete account', 'OK', {
            duration: 2000,
          });
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
