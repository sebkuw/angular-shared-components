import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog';
import { ConfirmationDialogData, ConfirmationDialogRequest } from './confirmation-dialog.models';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  constructor(private readonly dialog: MatDialog) {}

  confirm(request: ConfirmationDialogRequest): Observable<boolean> {
    const data: ConfirmationDialogData = {
      ...request,
      confirmLabel: request.confirmLabel ?? 'Confirm',
      cancelLabel: request.cancelLabel ?? 'Cancel',
      confirmTone: request.confirmTone ?? 'negative',
      actionsAriaLabel: request.actionsAriaLabel ?? 'Confirmation actions',
    };

    return this.dialog
      .open(ConfirmationDialogComponent, {
        data,
        autoFocus: 'first-tabbable',
        restoreFocus: true,
        disableClose: request.disableClose ?? false,
        maxWidth: 'calc(100vw - 2rem)',
        width: '32rem',
      })
      .afterClosed()
      .pipe(map((result: unknown) => result === true));
  }
}
