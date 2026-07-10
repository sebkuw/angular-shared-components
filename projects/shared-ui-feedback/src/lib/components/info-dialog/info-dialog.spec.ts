import { InfoDialogComponent } from './info-dialog';

describe('InfoDialogComponent', () => {
  it('exposes injected dialog data', () => {
    const component = new InfoDialogComponent({
      title: 'Info',
      content: 'Details',
      confirmationBtnText: 'Close',
    });

    expect(component.data.title).toBe('Info');
    expect(component.data.content).toBe('Details');
    expect(component.data.confirmationBtnText).toBe('Close');
  });
});
