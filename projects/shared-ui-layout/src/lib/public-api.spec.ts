import {
  MENU_DATA_TOKEN,
  PageHeaderComponent,
  SideMenu,
  SideMenuService,
  SkipLinkComponent,
  StepperComponent,
  StepperStepComponent,
} from '@sebkuw/shared-ui-layout';

describe('shared-ui-layout public API', () => {
  it('exports page header and side navigation contracts', () => {
    expect(PageHeaderComponent).toBeDefined();
    expect(SkipLinkComponent).toBeDefined();
    expect(SideMenu).toBeDefined();
    expect(SideMenuService).toBeDefined();
    expect(MENU_DATA_TOKEN).toBeDefined();
    expect(StepperComponent).toBeDefined();
    expect(StepperStepComponent).toBeDefined();
  });
});
