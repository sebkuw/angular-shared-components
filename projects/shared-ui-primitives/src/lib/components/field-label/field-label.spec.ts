import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldLabelComponent } from './field-label';

describe('FieldLabelComponent', () => {
  let fixture: ComponentFixture<FieldLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FieldLabelComponent] }).compileComponents();
    fixture = TestBed.createComponent(FieldLabelComponent);
    fixture.componentRef.setInput('forId', 'order-reference');
    fixture.componentRef.setInput('text', 'Order reference');
    fixture.detectChanges();
  });

  it('renders a visible native label associated with the configured control', () => {
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(label.htmlFor).toBe('order-reference');
    expect(label.textContent).toContain('Order reference');
  });

  it('adds a visible marker and localized screen-reader text for required fields', () => {
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.setInput('requiredText', 'Pole wymagane');
    fixture.detectChanges();

    const marker = fixture.nativeElement.querySelector('.shared-field-label__required-marker');
    const hiddenText = fixture.nativeElement.querySelector('.shared-field-label__visually-hidden');
    expect(marker.textContent).toContain('*');
    expect(marker.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenText.textContent).toContain('Pole wymagane');
  });
});
