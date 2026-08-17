import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeTone = 'neutral' | 'primary' | 'positive' | 'warning' | 'negative';
export type BadgeAnnouncement = 'off' | 'polite' | 'assertive';

@Component({
  selector: 'shared-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  @Input() value: string | number | null | undefined;
  @Input() max = 99;
  @Input() tone: BadgeTone = 'neutral';
  @Input() dot = false;
  @Input() showZero = false;
  @Input() ariaLabel?: string;
  @Input() announcement: BadgeAnnouncement = 'off';

  get visible(): boolean {
    if (this.dot) {
      return true;
    }

    return !(
      this.value === null ||
      this.value === undefined ||
      this.value === '' ||
      (this.value === 0 && !this.showZero)
    );
  }

  get displayValue(): string {
    if (this.dot) {
      return '';
    }

    if (typeof this.value === 'number' && this.value > this.max) {
      return `${this.max}+`;
    }

    return String(this.value ?? '');
  }

  get role(): 'status' | 'alert' | null {
    return this.announcement === 'assertive'
      ? 'alert'
      : this.announcement === 'polite'
        ? 'status'
        : null;
  }

  get ariaHidden(): 'true' | null {
    return this.dot && !this.ariaLabel && this.announcement === 'off' ? 'true' : null;
  }
}
