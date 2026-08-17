import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BadgeComponent } from '@sebkuw/shared-ui-primitives';
import { MenuItem } from './models/menu-item.interface';
import { SideMenuService } from './services/side-menu.service';

/**
 * SideMenu component displaying navigation structure.
 *
 * @input collapsed: boolean - controls whether menu is collapsed
 * @returns Renders navigation menu and handles interaction logic.
 */
@Component({
  selector: 'shared-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, BadgeComponent],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenu {
  // Wstrzykuj serwis menu (który pobiera dane przez InjectionToken z DI)
  public menuService = inject(SideMenuService);

  // Przekazuj collapse menu przez input
  @Input({ required: true }) collapsed!: boolean;
  @Input() ariaLabel = 'Primary navigation';

  @HostBinding('class.collapsed')
  get collapsedClass(): boolean {
    return this.collapsed;
  }

  toggleItem(item: MenuItem): void {
    this.menuService.toggleItem(item);
  }

  hasChildren(item: MenuItem): boolean {
    return !!item.children?.length;
  }
}
