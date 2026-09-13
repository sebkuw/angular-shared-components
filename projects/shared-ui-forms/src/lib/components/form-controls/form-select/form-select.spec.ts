import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormFieldSelect } from '../../../models/form-field.interface';
import { FormSelectComponent } from './form-select';

@Component({
  standalone: true,
  imports: [FormSelectComponent],
  template: '<shared-form-select [field]="field" [formGroup]="form" />',
})
class FormSelectHostComponent {
  readonly form = new FormGroup({ template: new FormControl<string | null>(null) });
  field: FormFieldSelect = {
    key: 'template',
    label: 'Szablon',
    type: 'select',
    placeholder: 'Wybierz opcję...',
    options: [{ key: 'default', value: 'Domyślny' }],
  };
}

describe('FormSelectComponent', () => {
  let fixture: ComponentFixture<FormSelectHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelectHostComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(FormSelectHostComponent);
    fixture.detectChanges();
  });

  it('uses the field label as the standalone combobox accessible name', () => {
    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;

    expect(combobox.getAttribute('aria-label')).toBe('Szablon');
    expect(combobox.textContent).toContain('Wybierz opcję...');
  });

  it('preserves the explicit ariaLabel override', () => {
    fixture.componentInstance.field = {
      ...fixture.componentInstance.field,
      ariaLabel: 'Wybór szablonu dokumentu',
    };
    fixture.detectChanges();

    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;
    expect(combobox.getAttribute('aria-label')).toBe('Wybór szablonu dokumentu');
  });
});
