import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading';

describe('LoadingComponent', () => {
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoadingComponent] }).compileComponents();
    fixture = TestBed.createComponent(LoadingComponent);
    fixture.detectChanges();
  });

  it('renders a polite, accessibly named loading status', () => {
    const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-label')).toBe('Loading');
    expect(status.querySelector('.shared-loading__spinner')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('supports a visible localized label and overlay mode', () => {
    fixture.componentRef.setInput('label', 'Ładowanie zamówień');
    fixture.componentRef.setInput('showLabel', true);
    fixture.componentRef.setInput('mode', 'overlay');
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
    expect(status.getAttribute('aria-label')).toBe('Ładowanie zamówień');
    expect(status.textContent).toContain('Ładowanie zamówień');
    expect(status.classList).toContain('shared-loading--overlay');
    expect(status.classList).toContain('shared-loading--large');
  });
});
