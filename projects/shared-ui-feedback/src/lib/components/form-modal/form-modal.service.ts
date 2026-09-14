import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormModalComponent } from './form-modal';
import { FormModalData, FormModalRequest } from './form-modal.models';
import { FormModalRef } from './form-modal.ref';

let nextDescriptionId = 0;

@Injectable({ providedIn: 'root' })
export class FormModalService {
  constructor(private readonly dialog: MatDialog) {}

  open<TResult = unknown>(request: FormModalRequest): FormModalRef<TResult> {
    const descriptionId = request.description
      ? `shared-form-modal-description-${nextDescriptionId++}`
      : undefined;
    const data: FormModalData = {
      ...request,
      submitLabel: request.submitLabel ?? 'Submit',
      cancelLabel: request.cancelLabel ?? 'Cancel',
      actionsAriaLabel: request.actionsAriaLabel ?? 'Form actions',
      errorStatusLabel: request.errorStatusLabel ?? 'Error',
      loadingLabel: request.loadingLabel ?? 'Submitting',
      submitTone: request.submitTone ?? 'primary',
      submitInaccessibleBehavior: request.submitInaccessibleBehavior ?? 'remove',
      descriptionId,
    };

    const dialogRef = this.dialog.open<FormModalComponent, FormModalData, TResult>(
      FormModalComponent,
      {
        data,
        ariaModal: true,
        ariaDescribedBy: descriptionId ?? null,
        autoFocus: request.autoFocus ?? 'first-tabbable',
        restoreFocus: true,
        disableClose: request.disableClose ?? false,
        width: request.width ?? '40rem',
        maxWidth: request.maxWidth ?? 'calc(100vw - 2rem)',
        maxHeight: request.maxHeight ?? 'calc(100dvh - 2rem)',
        panelClass: 'shared-form-modal-panel',
      },
    );

    return new FormModalRef<TResult>(dialogRef);
  }
}
