// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

/**
 * The root component of the J-Flix Angular application.
 * Primarily responsible for setting up the main router outlet.
 * Contains methods (though currently unused directly in the template) for opening login/registration dialogs.
 */
export class AppComponent {
  title = 'J-Flix-Angular-client';

  constructor(public dialog: MatDialog) {}

  /**
   * Opens the user registration dialog using MatDialog.
   * This method might be intended for use elsewhere or is legacy.
   * The welcome page component now handles opening this dialog.
   * @deprecated Use method in WelcomePageComponent instead.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens the user login dialog using MatDialog.
   * This method might be intended for use elsewhere or is legacy.
   * The welcome page component now handles opening this dialog.
   * @deprecated Use method in WelcomePageComponent instead.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
