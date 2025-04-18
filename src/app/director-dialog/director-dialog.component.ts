// src/app/director-dialog/director-dialog.component.ts
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-director-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './director-dialog.component.html',
  styleUrl: './director-dialog.component.scss',
})

/**
 * Component responsible for displaying director details within a MatDialog.
 * Receives director data via MAT_DIALOG_DATA injection.
 */
export class DirectorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DirectorDialogComponent>,
    /**
     * Injected data containing the director object to display.
     * Expected structure: `{ director: { Name: string, Bio: string, Birth?: string, Death?: string } }`
     * @Inject MAT_DIALOG_DATA
     */
    @Inject(MAT_DIALOG_DATA) public data: { director: any }
  ) {}

  /**
   * Closes the dialog window.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
