import {
  MENU_DATA_TOKEN,
  PageHeaderComponent,
  SideMenu,
  SideMenuService,
} from '@sebkuw/shared-ui-layout';

describe('shared-ui-layout public API', () => {
  it('exports page header and side navigation contracts', () => {
    expect(PageHeaderComponent).toBeDefined();
    expect(SideMenu).toBeDefined();
    expect(SideMenuService).toBeDefined();
    expect(MENU_DATA_TOKEN).toBeDefined();
  });
});
