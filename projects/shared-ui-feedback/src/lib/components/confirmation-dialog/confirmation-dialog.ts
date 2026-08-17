import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PUBLIC_ACCESS_RULE } from '@sebkuw/shared-ui-core';
import { ActionBarComponent, ButtonComponent } from '@sebkuw/shared-ui-primitives';
import { ConfirmationDialogData } from './confirmation-dialog.models';

@Component({
  selector: 'shared-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, ActionBarComponent, ButtonComponent],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  readonly publicAccess = PUBLIC_ACCESS_RULE;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmationDialogData,
    @Optional() private readonly dialogRef?: MatDialogRef<ConfirmationDialogComponent>,
  ) {}

  cancel(): void {
    this.dialogRef?.close(false);
  }

  confirm(): void {
    this.dialogRef?.close(true);
  }
}
