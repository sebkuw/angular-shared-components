import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state';

describe('ErrorStateComponent', () => {
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ErrorStateComponent] }).compileComponents();
    fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('title', 'Could not load orders');
    fixture.componentRef.setInput('description', 'Try again in a moment.');
    fixture.componentRef.setInput('retryLabel', 'Try again');
    fixture.componentRef.setInput('announcement', 'assertive');
    fixture.detectChanges();
  });

  it('uses assertive alert semantics only when configured', () => {
    const state = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(state.getAttribute('role')).toBe('alert');
    expect(state.getAttribute('aria-live')).toBe('assertive');
  });

  it('emits retry activation', () => {
    let retried = false;
    fixture.componentInstance.retry.subscribe(() => (retried = true));

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(retried).toBeTrue();
  });
});
