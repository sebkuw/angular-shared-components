import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface InfoDialogData {
  title: string;
  content: string;
  confirmationBtnText?: string;
}

@Component({
  selector: 'shared-info-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './info-dialog.html',
  styleUrl: './info-dialog.scss',
})
export class InfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InfoDialogData) {}
}
