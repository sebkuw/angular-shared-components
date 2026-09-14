import { MatDialogRef } from '@angular/material/dialog';
import { Observable, takeUntil } from 'rxjs';
import { FormModalComponent } from './form-modal';

export class FormModalRef<TResult = unknown> {
  readonly submitRequested: Observable<void>;

  constructor(private readonly dialogRef: MatDialogRef<FormModalComponent, TResult>) {
    this.submitRequested = dialogRef.componentInstance.submitRequested
      .asObservable()
      .pipe(takeUntil(dialogRef.afterClosed()));
  }

  afterClosed(): Observable<TResult | undefined> {
    return this.dialogRef.afterClosed();
  }

  close(result?: TResult): void {
    this.dialogRef.close(result);
  }

  setLoading(loading: boolean): void {
    this.dialogRef.componentInstance.setLoading(loading);
  }

  setDisabled(disabled: boolean): void {
    this.dialogRef.componentInstance.setDisabled(disabled);
  }

  setError(message: string | null): void {
    this.dialogRef.componentInstance.setError(message);
  }
}
