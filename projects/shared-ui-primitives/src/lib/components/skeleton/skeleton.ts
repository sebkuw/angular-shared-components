import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type SkeletonVariant = 'text' | 'rectangle' | 'circle';

@Component({
  selector: 'shared-skeleton',
  standalone: true,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() lines = 1;
  @Input() width = '100%';
  @Input() height?: string;
  @Input() label = 'Loading content';
  @Input() animated = true;

  get lineItems(): readonly number[] {
    const count = this.variant === 'text' ? Math.min(Math.max(Math.floor(this.lines), 1), 20) : 1;
    return Array.from({ length: count }, (_, index) => index);
  }

  get resolvedHeight(): string {
    if (this.height) {
      return this.height;
    }

    return this.variant === 'circle' ? this.width : this.variant === 'rectangle' ? '6rem' : '1rem';
  }
}
