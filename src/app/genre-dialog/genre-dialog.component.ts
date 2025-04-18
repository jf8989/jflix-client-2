// src/app/genre-dialog/genre-dialog.component.ts
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genre-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './genre-dialog.component.html',
  styleUrl: './genre-dialog.component.scss',
})

/**
 * Component responsible for displaying genre details within a MatDialog.
 * Receives genre data via MAT_DIALOG_DATA injection.
 */
export class GenreDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GenreDialogComponent>,
    /**
     * Injected data containing the genre object to display.
     * Expected structure: `{ genre: { Name: string, Description: string } }`
     * @Inject MAT_DIALOG_DATA
     */
    @Inject(MAT_DIALOG_DATA) public data: { genre: any }
  ) {}

  /**
   * Closes the dialog window.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
