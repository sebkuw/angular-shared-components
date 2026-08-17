import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessRule, InaccessibleBehavior, PUBLIC_ACCESS_RULE } from '@sebkuw/shared-ui-core';
import { ButtonComponent } from '../button/button';
import { ButtonTone } from '../button/button.models';
import { IconButtonComponent } from '../icon-button/icon-button';

export type InlineAlertTone = 'info' | 'success' | 'warning' | 'error';

export type LivePoliteness = 'polite' | 'assertive' | 'off';

@Component({
  selector: 'shared-inline-alert',
  standalone: true,
  imports: [ButtonComponent, IconButtonComponent],
  templateUrl: './inline-alert.html',
  styleUrl: './inline-alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineAlertComponent {
  @Input() tone: InlineAlertTone = 'info';
  @Input() title?: string;
  @Input() statusLabel?: string;
  @Input() announcement: LivePoliteness = 'polite';
  @Input() dismissible = false;
  @Input() dismissLabel = 'Dismiss alert';
  @Input() actionLabel?: string;
  @Input() actionAccess: AccessRule = PUBLIC_ACCESS_RULE;
  @Input() actionInaccessibleBehavior: InaccessibleBehavior = 'remove';

  @Output() readonly dismissed = new EventEmitter<void>();
  @Output() readonly actionTriggered = new EventEmitter<void>();

  get containerClasses(): string {
    return `shared-inline-alert shared-inline-alert--${this.tone}`;
  }

  get role(): 'alert' | 'status' | null {
    if (this.announcement === 'assertive') {
      return 'alert';
    }

    return this.announcement === 'polite' ? 'status' : null;
  }

  get resolvedStatusLabel(): string {
    if (this.statusLabel) {
      return this.statusLabel;
    }

    switch (this.tone) {
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return 'Information';
    }
  }

  get actionTone(): ButtonTone {
    return this.tone === 'error' ? 'negative' : this.tone === 'success' ? 'positive' : 'primary';
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  triggerAction(): void {
    this.actionTriggered.emit();
  }
}
