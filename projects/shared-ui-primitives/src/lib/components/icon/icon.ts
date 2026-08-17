import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { IconRegistry, IconSize, SHARED_ICON_REGISTRY } from './icon.models';

@Component({
  selector: 'shared-icon',
  standalone: true,
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input() name?: string;
  @Input() src?: string;
  @Input() size: IconSize = 'medium';
  @Input() decorative = true;
  @Input() ariaLabel?: string;

  constructor(@Inject(SHARED_ICON_REGISTRY) private readonly registry: IconRegistry) {}

  get resolvedSrc(): string | undefined {
    if (this.src) {
      return this.src;
    }

    if (!this.name) {
      return undefined;
    }

    const definition = this.registry[this.name];
    return typeof definition === 'string' ? definition : definition?.src;
  }

  get accessibleLabel(): string | null {
    return this.decorative ? null : (this.ariaLabel ?? this.name ?? null);
  }
}
