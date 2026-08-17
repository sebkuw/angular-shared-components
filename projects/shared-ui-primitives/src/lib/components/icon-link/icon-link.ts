import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
} from '@angular/core';
import { ButtonAppearance, ButtonSize, ButtonTone } from '../button/button.models';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'a[sharedIconLink]',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './icon-link.html',
  styleUrl: '../action-link/action-link.scss',
  host: { class: 'shared-action-link shared-icon-link' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconLinkComponent implements OnDestroy {
  @Input({ required: true }) ariaLabel!: string;
  @Input() iconName?: string;
  @Input() iconSrc?: string;
  @Input() tone: ButtonTone = 'primary';
  @Input() appearance: ButtonAppearance = 'text';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled = false;

  private readonly preventActivation = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  constructor(private readonly elementRef: ElementRef<HTMLAnchorElement>) {
    const link = this.elementRef.nativeElement;
    link.addEventListener('click', this.preventActivation, true);
    link.addEventListener('keydown', this.preventActivation, true);
  }

  @HostBinding('attr.aria-label') get accessibleLabel(): string {
    return this.ariaLabel;
  }

  @HostBinding('attr.data-tone') get toneAttribute(): ButtonTone {
    return this.tone;
  }

  @HostBinding('attr.data-appearance') get appearanceAttribute(): ButtonAppearance {
    return this.appearance;
  }

  @HostBinding('attr.data-size') get sizeAttribute(): ButtonSize {
    return this.size;
  }

  @HostBinding('attr.aria-disabled') get ariaDisabled(): string | null {
    return this.disabled ? 'true' : null;
  }

  @HostBinding('attr.tabindex') get tabIndex(): string | null {
    return this.disabled ? '-1' : null;
  }

  ngOnDestroy(): void {
    const link = this.elementRef.nativeElement;
    link.removeEventListener('click', this.preventActivation, true);
    link.removeEventListener('keydown', this.preventActivation, true);
  }

  focus(options?: FocusOptions): void {
    if (!this.disabled) {
      this.elementRef.nativeElement.focus(options);
    }
  }
}
