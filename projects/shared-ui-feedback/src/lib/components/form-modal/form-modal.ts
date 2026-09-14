import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Optional,
  Output,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PUBLIC_ACCESS_RULE } from '@sebkuw/shared-ui-core';
import {
  ActionBarComponent,
  ButtonComponent,
  InlineAlertComponent,
} from '@sebkuw/shared-ui-primitives';
import { FormModalData } from './form-modal.models';

@Component({
  selector: 'shared-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ActionBarComponent,
    ButtonComponent,
    InlineAlertComponent,
  ],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent {
  readonly publicAccess = PUBLIC_ACCESS_RULE;
  readonly loading = signal(false);
  readonly disabled = signal(false);
  readonly errorMessage = signal<string | null>(null);

  @Output() readonly submitRequested = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: FormModalData,
    @Optional() private readonly dialogRef?: MatDialogRef<FormModalComponent>,
  ) {
    this.loading.set(data.loading ?? false);
    this.disabled.set(data.disabled ?? false);
    this.errorMessage.set(data.errorMessage ?? null);
  }

  get actionsDisabled(): boolean {
    return this.disabled() || this.loading();
  }

  cancel(): void {
    if (!this.actionsDisabled) {
      this.dialogRef?.close();
    }
  }

  requestSubmit(): void {
    if (!this.actionsDisabled) {
      this.submitRequested.emit();
    }
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }

  setDisabled(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  setError(message: string | null): void {
    this.errorMessage.set(message);
  }
}
