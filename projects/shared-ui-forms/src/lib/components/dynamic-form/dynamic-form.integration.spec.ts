import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicFormConfig } from '../../models/form-field.interface';
import { DynamicFormComponent } from './dynamic-form';

@Component({
  standalone: true,
  imports: [DynamicFormComponent],
  template: '<shared-dynamic-form [config]="config" />',
})
class DynamicFormHostComponent {
  readonly config: DynamicFormConfig = {
    ariaLabel: 'Customer form',
    guidance: {
      showCompletion: true,
      errorSummaryTitle: 'Complete required fields',
    },
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        hint: 'Enter the legal name.',
        validators: [Validators.required],
        errorMessages: { required: 'Name is required.' },
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.required, Validators.email],
      },
      {
        key: 'template',
        label: 'Szablon',
        type: 'select',
        placeholder: 'Wybierz opcję...',
        options: [{ key: 'default', value: 'Domyślny' }],
      },
    ],
    submitButton: { labelCreate: 'Continue' },
  };
}

describe('DynamicFormComponent integration', () => {
  let fixture: ComponentFixture<DynamicFormHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormHostComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(DynamicFormHostComponent);
    fixture.detectChanges();
  });

  it('uses the shared shell for visible labels and associated hints', () => {
    const label = fixture.nativeElement.querySelector('label[for="name"]') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('#name') as HTMLInputElement;

    expect(label.textContent).toContain('Name');
    expect(label.textContent).toContain('Required');
    expect(input.getAttribute('aria-describedby')).toContain('name-hint');
    expect(fixture.nativeElement.querySelector('#name-hint').textContent).toContain(
      'Enter the legal name.',
    );
  });

  it('names the select combobox from its visible label instead of its placeholder', () => {
    const combobox = fixture.nativeElement.querySelector(
      '#template[role="combobox"]',
    ) as HTMLElement;
    const labelledBy = combobox.getAttribute('aria-labelledby')?.trim().split(/\s+/) ?? [];
    const accessibleName = labelledBy
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');

    expect(labelledBy).toContain('template-label');
    expect(accessibleName).toBe('Szablon');
    expect(accessibleName).not.toContain('Wybierz opcję...');
  });

  it('keeps submit available and focuses a linked summary after an invalid attempt', () => {
    const submit = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    expect(submit.disabled).toBeFalse();
    submit.click();
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector(
      '.shared-form-error-summary',
    ) as HTMLElement;
    expect(summary.textContent).toContain('Complete required fields');
    expect(summary.textContent).toContain('Name is required.');
    expect(document.activeElement).toBe(summary);
  });

  it('updates required-field completion as controls are filled', () => {
    const name = fixture.nativeElement.querySelector('#name') as HTMLInputElement;
    const email = fixture.nativeElement.querySelector('#email') as HTMLInputElement;
    const progress = fixture.nativeElement.querySelector('progress') as HTMLProgressElement;

    expect(progress.value).toBe(0);

    name.value = 'Anna';
    name.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(progress.value).toBe(50);

    email.value = 'anna@example.com';
    email.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(progress.value).toBe(100);
  });
});
