import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCompletionIndicatorComponent } from './form-completion-indicator';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormCompletionIndicatorComponent],
  template: `
    <shared-form-completion-indicator [form]="form" [fields]="fields" label="Completion" />
  `,
})
class FormCompletionHostComponent {
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    accepted: new FormControl(false, Validators.requiredTrue),
    optional: new FormControl(''),
  });
  readonly fields = [
    { key: 'name', label: 'Name' },
    { key: 'accepted', label: 'Terms' },
    { key: 'optional', label: 'Note' },
  ];
}

describe('FormCompletionIndicatorComponent', () => {
  let fixture: ComponentFixture<FormCompletionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCompletionHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormCompletionHostComponent);
    fixture.detectChanges();
  });

  it('counts only enabled required controls', () => {
    expect(fixture.nativeElement.textContent).toContain('0 of 2 required fields (0%)');
    expect(fixture.nativeElement.querySelector('progress').value).toBe(0);
  });

  it('reactively reports partial and complete progress', () => {
    fixture.componentInstance.form.controls.name.setValue('Anna');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('1 of 2 required fields (50%)');

    fixture.componentInstance.form.controls.accepted.setValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2 of 2 required fields (100%)');
  });

  it('excludes disabled required controls', () => {
    fixture.componentInstance.form.controls.accepted.disable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('0 of 1 required fields (0%)');
  });
});
