import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AccessRule,
  EMPTY_PERMISSION_CONTEXT,
  evaluateAccess,
  InaccessibleBehavior,
  PermissionService,
  PUBLIC_ACCESS_RULE,
} from '@sebkuw/shared-ui-core';
import {
  ButtonAppearance,
  ButtonSize,
  ButtonTone,
  ButtonType,
  IconPosition,
} from './button.models';

@Component({
  selector: 'shared-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() tone: ButtonTone = 'primary';
  @Input() appearance: ButtonAppearance = 'filled';
  @Input() size: ButtonSize = 'medium';
  @Input() type: ButtonType = 'button';
  @Input() iconSrc?: string;
  @Input() iconPosition: IconPosition = 'start';
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingLabel = 'Loading';
  @Input() fullWidth = false;
  @Input() access: AccessRule = PUBLIC_ACCESS_RULE;
  @Input() inaccessibleBehavior: InaccessibleBehavior = 'remove';

  @Output() readonly activated = new EventEmitter<MouseEvent>();

  @ViewChild('nativeButton') private nativeButton?: ElementRef<HTMLButtonElement>;

  private readonly permissionService: Pick<PermissionService, 'canAccess'>;

  constructor(@Optional() permissionService?: PermissionService) {
    this.permissionService = permissionService ?? {
      canAccess: (rule) => evaluateAccess(rule, EMPTY_PERMISSION_CONTEXT),
    };
  }

  get buttonClasses(): string {
    return [
      'shared-button',
      `shared-button--${this.tone}`,
      `shared-button--${this.appearance}`,
      `shared-button--${this.size}`,
      this.fullWidth ? 'shared-button--full-width' : '',
      this.loading ? 'shared-button--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  canRender(): boolean {
    return this.canAccess() || this.inaccessibleBehavior !== 'remove';
  }

  isHidden(): boolean {
    return !this.canAccess() && this.inaccessibleBehavior === 'hide';
  }

  isDisabled(): boolean {
    return (
      this.disabled ||
      this.loading ||
      (!this.canAccess() && this.inaccessibleBehavior === 'disable')
    );
  }

  accessibleLabel(): string | null {
    return this.loading ? this.loadingLabel : (this.ariaLabel ?? null);
  }

  onButtonClick(event: MouseEvent): void {
    if (!this.isDisabled() && !this.isHidden()) {
      this.activated.emit(event);
    }
  }

  focus(options?: FocusOptions): void {
    if (!this.isDisabled() && !this.isHidden()) {
      this.nativeButton?.nativeElement.focus(options);
    }
  }

  private canAccess(): boolean {
    return this.permissionService.canAccess(this.access);
  }
}
