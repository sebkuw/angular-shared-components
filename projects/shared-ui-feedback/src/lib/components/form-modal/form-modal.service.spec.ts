import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PermissionContext, providePermissionContext } from '@sebkuw/shared-ui-core';
import { FormModalRef } from './form-modal.ref';
import { FormModalService } from './form-modal.service';

@Component({
  standalone: true,
  template: `
    <button #trigger type="button" (click)="open()">Assign user</button>
    <ng-template #formContent>
      <form aria-label="Supplier assignment form">
        <label for="supplier">Supplier</label>
        <select id="supplier">
          <option value="">Choose a supplier</option>
          <option value="acme">Acme</option>
        </select>
      </form>
    </ng-template>
  `,
})
class FormModalHostComponent {
  @ViewChild('formContent', { static: true }) formContent!: TemplateRef<unknown>;
  modalRef?: FormModalRef<string>;

  constructor(private readonly modal: FormModalService) {}

  open(): void {
    this.modalRef = this.modal.open<string>({
      title: 'Assign user to supplier',
      description: 'Choose the supplier that should receive this user.',
      contentTemplate: this.formContent,
      submitLabel: 'Assign user',
      loadingLabel: 'Assigning user',
      cancelLabel: 'Cancel assignment',
      actionsAriaLabel: 'Supplier assignment actions',
    });
  }
}

describe('FormModalService integration', () => {
  let fixture: ComponentFixture<FormModalHostComponent>;
  let permissionContext: ReturnType<typeof signal<PermissionContext>>;

  beforeEach(async () => {
    permissionContext = signal<PermissionContext>({
      status: 'ready',
      authenticated: true,
      permissions: [],
      claims: {},
    });

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, FormModalHostComponent],
      providers: [provideNoopAnimations(), providePermissionContext(permissionContext)],
    }).compileComponents();

    fixture = TestBed.createComponent(FormModalHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MatDialog).closeAll());

  function openModal(): HTMLElement {
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    flush();
    return document.querySelector('[role="dialog"]') as HTMLElement;
  }

  it('renders projected form content with labels and focuses its first control', fakeAsync(() => {
    const dialog = openModal();
    const select = dialog.querySelector('select') as HTMLSelectElement;
    const describedBy = dialog.getAttribute('aria-describedby');

    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.textContent).toContain('Choose the supplier that should receive this user.');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy ?? '')?.textContent).toContain(
      'Choose the supplier',
    );
    expect(dialog.querySelector('form')?.getAttribute('aria-label')).toBe(
      'Supplier assignment form',
    );
    expect(document.activeElement).toBe(select);
  }));

  it('keeps the modal open for submit, exposes busy state and announces errors', fakeAsync(() => {
    const dialog = openModal();
    let submitCount = 0;
    fixture.componentInstance.modalRef?.submitRequested.subscribe(() => submitCount++);
    const buttons = Array.from(dialog.querySelectorAll('button')) as HTMLButtonElement[];

    buttons[1].click();
    expect(submitCount).toBe(1);
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    fixture.componentInstance.modalRef?.setLoading(true);
    fixture.detectChanges();
    expect(buttons.every((button) => button.disabled)).toBeTrue();
    expect(dialog.querySelector('.form-modal__form-content')?.hasAttribute('inert')).toBeTrue();
    expect(buttons[1].getAttribute('aria-busy')).toBe('true');
    expect(buttons[1].getAttribute('aria-label')).toBe('Assigning user');

    fixture.componentInstance.modalRef?.setLoading(false);
    fixture.componentInstance.modalRef?.setError('The assignment could not be saved.');
    fixture.detectChanges();
    const alert = dialog.querySelector('[role="alert"]') as HTMLElement;
    expect(alert.textContent).toContain('The assignment could not be saved.');
    expect(alert.getAttribute('aria-live')).toBe('assertive');

    let result: string | undefined;
    fixture.componentInstance.modalRef?.afterClosed().subscribe((value) => (result = value));
    fixture.componentInstance.modalRef?.close('assigned');
    flush();
    expect(result).toBe('assigned');
  }));

  it('closes with Escape and restores focus to the invoking control', fakeAsync(() => {
    const dialog = openModal();
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    Object.defineProperty(escape, 'keyCode', { get: () => 27 });
    dialog.dispatchEvent(escape);
    flush();

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('button'));
  }));

  it('removes a denied submit action and reacts when permission becomes available', fakeAsync(() => {
    const service = TestBed.inject(FormModalService);
    fixture.componentInstance.modalRef = service.open({
      title: 'Protected assignment',
      contentTemplate: fixture.componentInstance.formContent,
      submitAccess: { all: ['suppliers.assign'] },
    });
    fixture.detectChanges();
    flush();

    let dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.querySelectorAll('button').length).toBe(1);

    permissionContext.set({
      status: 'ready',
      authenticated: true,
      permissions: ['suppliers.assign'],
      claims: {},
    });
    fixture.detectChanges();
    dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.querySelectorAll('button').length).toBe(2);
  }));
});
