import { computed, Inject, Injectable, Optional, signal } from '@angular/core';
import {
  EMPTY_PERMISSION_CONTEXT,
  evaluateAccess,
  PermissionService,
  PUBLIC_ACCESS_RULE,
} from '@netdevs/shared-ui-core';
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

  constructor(
    @Inject(MENU_DATA_TOKEN) private menuData: MenuItem[],
    @Optional() permissionService?: PermissionService,
  ) {
    this.permissionService = permissionService ?? {
      canAccess: (rule) => evaluateAccess(rule, EMPTY_PERMISSION_CONTEXT),
    };
    this.menuItems.set(this.initializeMenuItems(this.menuData));
  }

  public flatMenuItems = computed(() => this.flatten(this.filterAccessible(this.menuItems())));

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

  private readonly permissionService: Pick<PermissionService, 'canAccess'>;

  private filterAccessible(items: MenuItem[]): MenuItem[] {
    return items
      .filter((item) => this.permissionService.canAccess(item.access ?? PUBLIC_ACCESS_RULE))
      .map((item) => ({
        ...item,
        children: item.children ? this.filterAccessible(item.children) : undefined,
      }));
  }

  public toggleItem(itemToToggle: MenuItem): void {
    this.menuItems.update((currentItems) =>
      currentItems.map((item) => {
        if (item.id === itemToToggle.id) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return {
            ...item,
            children: this.toggleRecursively(item.children, itemToToggle),
          };
        }
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
