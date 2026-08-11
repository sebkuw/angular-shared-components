import { InfoDialogComponent, NotificationComponent } from '@netdevs/shared-ui-feedback';

describe('shared-ui-feedback public API', () => {
  it('exports dialog and notification components', () => {
    expect(InfoDialogComponent).toBeDefined();
    expect(NotificationComponent).toBeDefined();
  });
});
