import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormFieldTable } from '../../../models/form-field.interface';
import { FormTableComponent } from './form-table';

describe('FormTableComponent', () => {
  let fixture: ComponentFixture<FormTableComponent>;
  let component: FormTableComponent;

  const field: FormFieldTable = {
    key: 'lines',
    label: 'Lines',
    type: 'table',
    columns: [{ key: 'description', label: 'Description', type: 'text' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(FormTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('formGroup', new FormGroup({}));
    fixture.detectChanges();
  });

  it('aligns the add-row action to the end by default', () => {
    const actions = fixture.nativeElement.querySelector('.table-actions') as HTMLElement;
    expect(actions.classList).not.toContain('table-actions--start');
  });

  it('supports backward-compatible start alignment without changing action order', () => {
    fixture.componentRef.setInput('field', { ...field, addActionAlignment: 'start' });
    fixture.detectChanges();

    const actions = fixture.nativeElement.querySelector('.table-actions') as HTMLElement;
    expect(actions.classList).toContain('table-actions--start');
    expect(actions.querySelector('button')?.getAttribute('aria-label')).toBe('Add row');
  });
});
