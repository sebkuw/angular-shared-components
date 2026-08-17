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
import { ButtonAppearance, ButtonSize, ButtonTone, ButtonType } from '../button/button.models';

@Component({
  selector: 'shared-icon-button',
  standalone: true,
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input() iconSrc?: string;
  @Input({ required: true }) ariaLabel!: string;
  @Input() ariaDescribedBy?: string;
  @Input() ariaControls?: string;
  @Input() ariaExpanded?: boolean;
  @Input() tone: ButtonTone = 'neutral';
  @Input() appearance: ButtonAppearance = 'text';
  @Input() size: ButtonSize = 'medium';
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingLabel = 'Loading';
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
      'shared-icon-button',
      `shared-icon-button--${this.tone}`,
      `shared-icon-button--${this.appearance}`,
      `shared-icon-button--${this.size}`,
    ].join(' ');
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

  accessibleLabel(): string {
    return this.loading ? this.loadingLabel : this.ariaLabel;
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
