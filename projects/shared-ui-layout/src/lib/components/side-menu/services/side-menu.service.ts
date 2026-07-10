import { computed, Inject, Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/menu-item.interface';
import { MENU_DATA_TOKEN } from '../utils/menu-data.token';

/**
 * Service for managing menu state and structure.
 * @param menuData Array<MenuItem> injected by DI via MENU_DATA token.
 * @returns Service controlling menu logic, expanded state, and data structure.
 */
@Injectable({ providedIn: 'root' })
export class SideMenuService {
  private menuItems = signal<MenuItem[]>([]);

  constructor(@Inject(MENU_DATA_TOKEN) private menuData: MenuItem[]) {
    this.menuItems.set(this.initializeMenuItems(this.menuData));
  }

  public flatMenuItems = computed(() => this.flatten(this.menuItems()));

  private initializeMenuItems(items: MenuItem[]): MenuItem[] {
    return items.map((item) => ({
      ...item,
      expanded: false,
      children: item.children ? this.initializeMenuItems(item.children) : undefined,
    }));
  }

  private flatten(items: MenuItem[]): MenuItem[] {
    return items.reduce((acc, item) => {
      acc.push(item);
      if (item.expanded && item.children) {
        acc.push(...this.flatten(item.children));
      }
      return acc;
    }, [] as MenuItem[]);
  }

  public toggleItem(itemToToggle: MenuItem): void {
    this.menuItems.update((currentItems) =>
      currentItems.map((item) => {
        if (item.id === itemToToggle.id) return { ...item, expanded: !item.expanded };
        if (item.children)
          return { ...item, children: this.toggleRecursively(item.children, itemToToggle) };
        return item;
      }),
    );
  }

  private toggleRecursively(items: MenuItem[], itemToToggle: MenuItem): MenuItem[] {
    return items.map((item) =>
      item.id === itemToToggle.id
        ? { ...item, expanded: !item.expanded }
        : item.children
          ? { ...item, children: this.toggleRecursively(item.children, itemToToggle) }
          : item,
    );
  }
}
