import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessRule, PUBLIC_ACCESS_RULE } from '@sebkuw/shared-ui-core';
import { ButtonComponent, ButtonTone, IconComponent } from '@sebkuw/shared-ui-primitives';
import { StateAnnouncement, StateHeadingLevel } from '../state.models';

@Component({
  selector: 'shared-error-state',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './error-state.html',
  styleUrl: '../empty-state/empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() iconName?: string;
  @Input() iconSrc?: string;
  @Input() headingLevel: StateHeadingLevel = 3;
  @Input() announcement: StateAnnouncement = 'polite';
  @Input() retryLabel?: string;
  @Input() retryAriaLabel?: string;
  @Input() retryTone: ButtonTone = 'primary';
  @Input() retryAccess?: AccessRule;

  readonly publicAccess = PUBLIC_ACCESS_RULE;

  @Output() readonly retry = new EventEmitter<void>();

  get role(): 'status' | 'alert' | null {
    return this.announcement === 'assertive'
      ? 'alert'
      : this.announcement === 'polite'
        ? 'status'
        : null;
  }
}
