import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressComponent } from './progress';

describe('ProgressComponent', () => {
  let fixture: ComponentFixture<ProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProgressComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProgressComponent);
    fixture.detectChanges();
  });

  it('renders a labelled determinate native progress element', () => {
    fixture.componentRef.setInput('label', 'Upload progress');
    fixture.componentRef.setInput('value', 45);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('progress') as HTMLProgressElement;
    expect(progress.getAttribute('aria-label')).toBe('Upload progress');
    expect(progress.value).toBe(45);
    expect(progress.getAttribute('aria-valuetext')).toBe('45%');
    expect(fixture.nativeElement.textContent).toContain('45%');
  });

  it('clamps values and supports a localized formatter', () => {
    fixture.componentRef.setInput('value', 12);
    fixture.componentRef.setInput('max', 10);
    fixture.componentRef.setInput('formatValue', (value: number) => `${value} z 10`);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('progress') as HTMLProgressElement;
    expect(progress.value).toBe(10);
    expect(progress.getAttribute('aria-valuetext')).toBe('10 z 10');
  });

  it('omits the value for an indeterminate state', () => {
    fixture.componentRef.setInput('mode', 'indeterminate');
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('progress') as HTMLProgressElement;
    expect(progress.hasAttribute('value')).toBeFalse();
    expect(progress.hasAttribute('aria-valuetext')).toBeFalse();
  });
});
