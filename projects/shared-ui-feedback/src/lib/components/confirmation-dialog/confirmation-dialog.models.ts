import { AccessRule } from '@sebkuw/shared-ui-core';
import { ButtonTone } from '@sebkuw/shared-ui-primitives';

export interface ConfirmationDialogRequest {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly confirmAriaLabel?: string;
  readonly cancelAriaLabel?: string;
  readonly actionsAriaLabel?: string;
  readonly confirmTone?: ButtonTone;
  readonly confirmAccess?: AccessRule;
  readonly disableClose?: boolean;
}

export interface ConfirmationDialogData extends ConfirmationDialogRequest {
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly confirmTone: ButtonTone;
  readonly actionsAriaLabel: string;
}
