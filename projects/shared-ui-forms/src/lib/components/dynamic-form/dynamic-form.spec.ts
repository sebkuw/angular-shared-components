import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form';

describe('DynamicFormComponent', () => {
  function createComponent(): DynamicFormComponent {
    return new DynamicFormComponent(new FormBuilder());
  }

  it('builds controls from field configuration and patches initial data', () => {
    const component = createComponent();

    component.config = {
      fields: [
        { key: 'name', label: 'Name', type: 'text', validators: [Validators.required] },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'gap', label: '', type: 'spacer' },
      ],
    };
    component.initialData = {
      name: 'Anna',
      email: 'anna@example.com',
    };

    component.ngOnInit();

    expect(component.form.get('name')?.value).toBe('Anna');
    expect(component.form.get('email')?.value).toBe('anna@example.com');
    expect(component.form.get('gap')).toBeNull();
    expect(component.form.valid).toBeTrue();
  });

  it('creates form arrays for table fields', () => {
    const component = createComponent();

    component.config = {
      fields: [
        {
          key: 'items',
          label: 'Items',
          type: 'table',
          columns: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'quantity', label: 'Quantity', type: 'number' },
          ],
        },
      ],
    };
    component.initialData = {
      items: [
        { name: 'Keyboard', quantity: 1 },
        { name: 'Mouse', quantity: 2 },
      ],
    };

    component.ngOnInit();

    const items = component.form.get('items');
    expect(items instanceof FormArray).toBeTrue();
    expect((items as FormArray).length).toBe(2);
    expect((items as FormArray).at(1).get('quantity')?.value).toBe(2);
  });

  it('disables conditionally hidden controls and enables them when condition is met', () => {
    const component = createComponent();

    component.config = {
      fields: [
        { key: 'type', label: 'Type', type: 'select', options: [] },
        {
          key: 'reason',
          label: 'Reason',
          type: 'text',
          validators: [Validators.required],
          showWhen: {
            logic: 'AND',
            conditions: [{ field: 'type', operator: 'eq', value: 'other' }],
          },
        },
      ],
    };

    component.ngOnInit();

    const reason = component.form.get('reason');
    expect(reason?.disabled).toBeTrue();

    component.form.get('type')?.setValue('other');

    expect(reason?.enabled).toBeTrue();
    expect(reason?.hasValidator(Validators.required)).toBeTrue();

    component.ngOnDestroy();
  });

  it('emits raw form value only when form is valid', () => {
    const component = createComponent();
    const emittedValues: Record<string, unknown>[] = [];

    component.formSubmit.subscribe((value) => emittedValues.push(value));
    component.config = {
      fields: [{ key: 'name', label: 'Name', type: 'text', validators: [Validators.required] }],
    };

    component.ngOnInit();
    component.onSubmit();

    expect(emittedValues.length).toBe(0);

    component.form.get('name')?.setValue('Anna');
    component.onSubmit();

    expect(emittedValues).toEqual([{ name: 'Anna' }]);
  });

  it('accepts type-specific configuration for every supported field kind', () => {
    const component = createComponent();

    component.config = {
      fields: [
        { key: 'text', label: 'Text', type: 'text', maxLength: 20 },
        { key: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
        { key: 'password', label: 'Password', type: 'password', maxLength: 64 },
        { key: 'number', label: 'Number', type: 'number', min: 0, max: 10, step: 1 },
        { key: 'date', label: 'Date', type: 'date', minDate: new Date(2026, 0, 1) },
        { key: 'select', label: 'Select', type: 'select', options: [] },
        { key: 'multi', label: 'Multi', type: 'multi-select', options: [] },
        { key: 'textarea', label: 'Textarea', type: 'textarea', rows: 3, maxLength: 80 },
        { key: 'checkbox', label: 'Checkbox', type: 'checkbox' },
        { key: 'file', label: 'File', type: 'file', acceptedFileTypes: '.pdf' },
        { key: 'spacer', label: 'Spacer', type: 'spacer', text: 'Section' },
        {
          key: 'table',
          label: 'Table',
          type: 'table',
          minRows: 1,
          columns: [{ key: 'cell', label: 'Cell', type: 'text', maxLength: 10 }],
        },
      ],
    };

    component.ngOnInit();

    expect(component.form.contains('spacer')).toBeFalse();
    expect(component.form.get('table') instanceof FormArray).toBeTrue();
    expect(Object.keys(component.form.controls).length).toBe(11);
  });
});
