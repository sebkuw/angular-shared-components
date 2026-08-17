import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldShellComponent } from './form-field-shell';

@Component({
  standalone: true,
  imports: [FormFieldShellComponent],
  template: `
    <shared-form-field-shell
      #shell
      controlId="reference"
      label="Reference"
      [required]="true"
      requiredText="Pole wymagane"
      hint="Use the number from the contract."
      error="Reference is invalid."
      [currentLength]="4"
      [maxLength]="12"
    >
      <input id="reference" [attr.aria-describedby]="shell.describedBy" />
    </shared-form-field-shell>
  `,
})
class FormFieldShellHostComponent {}

describe('FormFieldShellComponent', () => {
  let fixture: ComponentFixture<FormFieldShellHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldShellHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormFieldShellHostComponent);
    fixture.detectChanges();
  });

  it('associates a visible required label with projected content', () => {
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(label.htmlFor).toBe('reference');
    expect(label.textContent).toContain('Reference');
    expect(label.textContent).toContain('Pole wymagane');
  });

  it('exposes stable described-by ids for hint, error and character count', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('aria-describedby')).toBe(
      'reference-hint reference-error reference-character-count',
    );
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Reference is invalid.',
    );
    expect(fixture.nativeElement.textContent).toContain('4 of 12 characters');
  });
});
