import { InfoDialogComponent } from './info-dialog';
import { MatDialogRef } from '@angular/material/dialog';

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

  it('closes with a positive result when the shared confirmation button is activated', () => {
    const dialogRef = jasmine.createSpyObj<MatDialogRef<InfoDialogComponent>>('MatDialogRef', [
      'close',
    ]);
    const component = new InfoDialogComponent(
      { title: 'Info', content: 'Details' },
      undefined,
      dialogRef,
    );

    component.confirm();

    expect(dialogRef.close).toHaveBeenCalledOnceWith(true);
  });
});
