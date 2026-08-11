import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  AccessRule,
  EMPTY_PERMISSION_CONTEXT,
  evaluateAccess,
  PermissionService,
  PUBLIC_ACCESS_RULE,
} from '@sebkuw/shared-ui-core';

export interface InfoClickData {
  title: string;
  content: string;
  confirmationBtnText?: string;
  iconName?: string;
}

@Component({
  selector: 'shared-page-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  private readonly permissionService: Pick<PermissionService, 'canAccess'>;

  constructor(@Optional() permissionService?: PermissionService) {
    this.permissionService = permissionService ?? {
      canAccess: (rule) => evaluateAccess(rule, EMPTY_PERMISSION_CONTEXT),
    };
  }

  @Input({ required: true }) headerText!: string;

  @Input() infoTitle?: string;
  @Input() infoContent?: string;
  @Input() confirmationBtnText?: string;
  @Input() iconName: string = 'info_outline';
  @Input() infoAriaLabel = 'Show information';
  @Input() infoAccess: AccessRule = PUBLIC_ACCESS_RULE;

  @Output() infoClick = new EventEmitter<InfoClickData>();

  onInfoClick(): void {
    if (this.infoContent) {
      this.infoClick.emit({
        title: this.infoTitle || 'Informacja',
        content: this.infoContent,
        confirmationBtnText: this.confirmationBtnText,
        iconName: this.iconName,
      });
    }
  }

  canShowInfo(): boolean {
    return !!this.infoContent && this.permissionService.canAccess(this.infoAccess);
  }
}
