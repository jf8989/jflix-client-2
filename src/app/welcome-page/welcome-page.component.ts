// src/app/welcome-page/welcome-page.component.ts
import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})

/**
 * Component for the application's welcome screen.
 * Provides buttons for users to open the login or registration dialogs.
 */
export class WelcomePageComponent {
  constructor(public dialog: MatDialog) {}

  /**
   * Opens the UserRegistrationFormComponent in a dialog window.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens the UserLoginFormComponent in a dialog window.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
