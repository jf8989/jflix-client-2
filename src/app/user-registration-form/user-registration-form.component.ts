// src/app/user-registration-form/user-registration-form.component.ts

import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
  ],
})

/**
 * Component responsible for the user registration form.
 * Presented within a MatDialog. Collects user input and uses FetchApiDataService
 * to register the user. Provides feedback via MatSnackBar.
 */
export class UserRegistrationFormComponent {
  /**
   * Input property holding the user registration data, bound to the form fields.
   * Contains Username, Password, Email, and Birthday.
   * @Input
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Called when the registration form is submitted.
   * Uses FetchApiDataService to send registration data to the backend.
   * Handles success and error responses, closing the dialog on success
   * and showing snack bar messages for feedback.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        // Logic for a successful registration
        this.dialogRef.close(); // Close the modal
        console.log(result);
        this.snackBar.open('User registered successfully!', 'OK', {
          duration: 2000,
        });
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
