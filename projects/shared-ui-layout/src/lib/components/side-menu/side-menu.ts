import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenu {
  // Wstrzykuj serwis menu (który pobiera dane przez InjectionToken z DI)
  public menuService = inject(SideMenuService);

  // Przekazuj collapse menu przez input
  @Input({ required: true }) collapsed!: boolean;

  @HostBinding('class.collapsed')
  get collapsedClass(): boolean {
    return this.collapsed;
  }

  onItemClick(item: MenuItem, event: Event): void {
    if (this.collapsed) return;
    if (item.children && item.children.length > 0) {
      event.preventDefault();
      this.menuService.toggleItem(item);
    }
  }

  getLevelColor(level: number): string {
    switch (level) {
      case 1:
        return '#f5f5f5';
      case 2:
        return '#e0e0e0';
      case 3:
        return '#d0d0d0';
      default:
        return '#ffffff';
    }
  }
}
