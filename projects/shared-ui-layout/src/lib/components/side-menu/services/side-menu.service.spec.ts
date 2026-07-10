import { MenuItem } from '../models/menu-item.interface';
import { SideMenuService } from './side-menu.service';

describe('SideMenuService', () => {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      level: 0,
      route: '/dashboard',
    },
    {
      id: 'users',
      title: 'Users',
      icon: 'group',
      level: 0,
      children: [
        {
          id: 'users-list',
          title: 'User list',
          icon: 'list',
          level: 1,
          route: '/users',
        },
      ],
    },
  ];

  function createService(): SideMenuService {
    return new SideMenuService(menuItems);
  }

  it('starts with only top-level items flattened', () => {
    const service = createService();

    expect(service.flatMenuItems().map((item) => item.id)).toEqual(['dashboard', 'users']);
  });

  it('adds children to flattened menu after toggling parent item', () => {
    const service = createService();
    const usersItem = service.flatMenuItems().find((item) => item.id === 'users');

    service.toggleItem(usersItem!);

    expect(service.flatMenuItems().map((item) => item.id)).toEqual([
      'dashboard',
      'users',
      'users-list',
    ]);
  });
});
