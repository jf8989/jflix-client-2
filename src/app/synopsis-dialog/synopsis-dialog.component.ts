// src/app/synopsis-dialog/synopsis-dialog.component.ts
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-synopsis-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './synopsis-dialog.component.html',
  styleUrl: './synopsis-dialog.component.scss',
})

/**
 * Component responsible for displaying movie synopsis details within a MatDialog.
 * Receives movie title and description via MAT_DIALOG_DATA injection.
 */
export class SynopsisDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SynopsisDialogComponent>,
    /**
     * Injected data containing the movie title and description to display.
     * Expected structure: `{ title: string, description: string }`
     * @Inject MAT_DIALOG_DATA
     */
    @Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }
  ) {}

  /**
   * Closes the dialog window.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
