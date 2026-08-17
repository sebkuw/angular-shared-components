import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FormErrorSummaryComponent } from './form-error-summary';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorSummaryComponent],
  template: `
    <shared-form-error-summary
      [form]="form"
      [fields]="fields"
      title="Fix these fields"
      description="Two values need attention."
    />
    <input id="name" [formControl]="form.controls.name" />
  `,
})
class FormErrorSummaryHostComponent {
  readonly form = new FormGroup({ name: new FormControl('', Validators.required) });
  readonly fields = [
    { key: 'name', label: 'Customer name', errorMessages: { required: 'Enter a name.' } },
  ];
}

describe('FormErrorSummaryComponent', () => {
  let fixture: ComponentFixture<FormErrorSummaryHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorSummaryHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormErrorSummaryHostComponent);
    fixture.detectChanges();
  });

  it('lists invalid configured controls with custom messages', () => {
    const alert = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;

    expect(alert.textContent).toContain('Fix these fields');
    expect(alert.textContent).toContain('Customer name:');
    expect(alert.textContent).toContain('Enter a name.');
  });

  it('moves focus to an invalid control from its native link', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    link.click();

    expect(document.activeElement).toBe(input);
  });

  it('reactively removes corrected errors', () => {
    fixture.componentInstance.form.controls.name.setValue('Anna');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('does not access a focus target on the server', () => {
    const component = new FormErrorSummaryComponent(
      { markForCheck: () => undefined } as ChangeDetectorRef,
      document,
      'server',
    );
    const event = new Event('click', { cancelable: true });

    component.focusControl(event, 'name');

    expect(event.defaultPrevented).toBeTrue();
  });
});
