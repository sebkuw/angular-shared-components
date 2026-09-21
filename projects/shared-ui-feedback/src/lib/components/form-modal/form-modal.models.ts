import { TemplateRef } from '@angular/core';
import { AccessRule, InaccessibleBehavior } from '@sebkuw/shared-ui-core';
import { ButtonTone } from '@sebkuw/shared-ui-primitives';
import { AutoFocusTarget } from '@angular/material/dialog';

export interface FormModalRequest {
  readonly title: string;
  readonly contentTemplate: TemplateRef<unknown>;
  readonly description?: string;
  readonly submitLabel?: string;
  readonly cancelLabel?: string;
  readonly submitAriaLabel?: string;
  readonly cancelAriaLabel?: string;
  readonly actionsAriaLabel?: string;
  readonly errorStatusLabel?: string;
  readonly loadingLabel?: string;
  readonly submitTone?: ButtonTone;
  readonly submitAccess?: AccessRule;
  readonly submitInaccessibleBehavior?: InaccessibleBehavior;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly errorMessage?: string | null;
  readonly disableClose?: boolean;
  readonly autoFocus?: AutoFocusTarget | string;
  readonly width?: string;
  readonly maxWidth?: string;
  readonly maxHeight?: string;
}

export interface FormModalData extends FormModalRequest {
  readonly submitLabel: string;
  readonly cancelLabel: string;
  readonly actionsAriaLabel: string;
  readonly errorStatusLabel: string;
  readonly loadingLabel: string;
  readonly submitTone: ButtonTone;
  readonly submitInaccessibleBehavior: InaccessibleBehavior;
  readonly descriptionId?: string;
}
