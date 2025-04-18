// src/app/user-login-form/user-login-form.component.ts

import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
  ],
})

/**
 * Component responsible for the user login form.
 * Presented within a MatDialog. Collects user credentials and uses FetchApiDataService
 * to authenticate the user. Stores user data and token in localStorage on success,
 * navigates to the movies page, and provides feedback via MatSnackBar.
 */
export class UserLoginFormComponent {
  /**
   * Input property holding the user login credentials (Username, Password),
   * bound to the form fields.
   * @Input
   */
  @Input() loginData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Called when the login form is submitted.
   * Uses FetchApiDataService to send login credentials to the backend.
   * Handles success and error responses: stores user/token, closes dialog,
   * navigates to '/movies' on success, and shows snack bar messages for feedback.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.loginData).subscribe({
      next: (result) => {
        // Logic for a successful login
        console.log(result);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        this.dialogRef.close(); // Close the modal
        this.snackBar.open('User logged in successfully!', 'OK', {
          duration: 2000,
        });
        // Navigate to movies page after login (we'll implement this route later)
        this.router.navigate(['movies']);
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', {
          duration: 2000,
        });
      },
    });
  }
}
