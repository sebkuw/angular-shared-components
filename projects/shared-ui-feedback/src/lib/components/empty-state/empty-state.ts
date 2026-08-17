import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessRule, PUBLIC_ACCESS_RULE } from '@sebkuw/shared-ui-core';
import { ButtonComponent, ButtonTone, IconComponent } from '@sebkuw/shared-ui-primitives';
import { StateAnnouncement, StateHeadingLevel } from '../state.models';

@Component({
  selector: 'shared-empty-state',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() iconName?: string;
  @Input() iconSrc?: string;
  @Input() headingLevel: StateHeadingLevel = 3;
  @Input() announcement: StateAnnouncement = 'polite';
  @Input() actionLabel?: string;
  @Input() actionAriaLabel?: string;
  @Input() actionTone: ButtonTone = 'primary';
  @Input() actionAccess?: AccessRule;

  readonly publicAccess = PUBLIC_ACCESS_RULE;

  @Output() readonly actionTriggered = new EventEmitter<void>();

  get role(): 'status' | 'alert' | null {
    return this.announcement === 'assertive'
      ? 'alert'
      : this.announcement === 'polite'
        ? 'status'
        : null;
  }
}
