import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ProgressMode = 'determinate' | 'indeterminate';
export type ProgressTone = 'primary' | 'positive' | 'warning' | 'negative';

@Component({
  selector: 'shared-progress',
  standalone: true,
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  @Input() label = 'Progress';
  @Input() value = 0;
  @Input() max = 100;
  @Input() mode: ProgressMode = 'determinate';
  @Input() tone: ProgressTone = 'primary';
  @Input() showValue = true;
  @Input() formatValue?: (value: number, max: number) => string;

  get normalizedMax(): number {
    return this.max > 0 ? this.max : 1;
  }

  get clampedValue(): number {
    return Math.min(Math.max(this.value, 0), this.normalizedMax);
  }

  get percentage(): number {
    return (this.clampedValue / this.normalizedMax) * 100;
  }

  get valueText(): string {
    return this.formatValue
      ? this.formatValue(this.clampedValue, this.normalizedMax)
      : `${Math.round(this.percentage)}%`;
  }
}
