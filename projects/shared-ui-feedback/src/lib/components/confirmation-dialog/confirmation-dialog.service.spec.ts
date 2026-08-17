import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('ConfirmationDialogService integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  afterEach(() => TestBed.inject(MatDialog).closeAll());

  it('opens a real focus-trapped overlay with initial focus on cancel', fakeAsync(() => {
    const service = TestBed.inject(ConfirmationDialogService);
    let result: boolean | undefined;

    service
      .confirm({
        title: 'Remove order?',
        message: 'This cannot be undone.',
        cancelLabel: 'Keep order',
        confirmLabel: 'Remove order',
      })
      .subscribe((value) => (result = value));
    flush();

    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    const buttons = Array.from(dialog.querySelectorAll('button')) as HTMLButtonElement[];
    expect(dialog.textContent).toContain('This cannot be undone.');
    expect(document.activeElement).toBe(buttons[0]);

    buttons[1].click();
    flush();
    expect(result).toBeTrue();
  }));
});
