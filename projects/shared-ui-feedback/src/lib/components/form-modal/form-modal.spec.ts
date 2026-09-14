import { TemplateRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormModalComponent } from './form-modal';
import { FormModalData } from './form-modal.models';

describe('FormModalComponent', () => {
  function createComponent(): {
    component: FormModalComponent;
    dialogRef: jasmine.SpyObj<MatDialogRef<FormModalComponent>>;
  } {
    const dialogRef = jasmine.createSpyObj<MatDialogRef<FormModalComponent>>('MatDialogRef', [
      'close',
    ]);
    const data: FormModalData = {
      title: 'Assign user',
      contentTemplate: {} as TemplateRef<unknown>,
      submitLabel: 'Assign',
      cancelLabel: 'Cancel',
      actionsAriaLabel: 'Assignment actions',
      errorStatusLabel: 'Assignment error',
      loadingLabel: 'Assigning user',
      submitTone: 'primary',
      submitInaccessibleBehavior: 'remove',
    };

    return { component: new FormModalComponent(data, dialogRef), dialogRef };
  }

  it('emits submit without closing so asynchronous forms can control completion', () => {
    const { component, dialogRef } = createComponent();
    let submitCount = 0;
    component.submitRequested.subscribe(() => submitCount++);

    component.requestSubmit();

    expect(submitCount).toBe(1);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('blocks all actions while loading or disabled', () => {
    const { component, dialogRef } = createComponent();
    let submitCount = 0;
    component.submitRequested.subscribe(() => submitCount++);

    component.setLoading(true);
    component.requestSubmit();
    component.cancel();
    component.setLoading(false);
    component.setDisabled(true);
    component.requestSubmit();
    component.cancel();

    expect(component.actionsDisabled).toBeTrue();
    expect(submitCount).toBe(0);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('updates an actionable error and closes through the safe cancel action', () => {
    const { component, dialogRef } = createComponent();

    component.setError('Choose a supplier.');
    component.cancel();

    expect(component.errorMessage()).toBe('Choose a supplier.');
    expect(dialogRef.close).toHaveBeenCalledOnceWith();
  });
});
