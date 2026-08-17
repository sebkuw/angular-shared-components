import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EmptyStateComponent] }).compileComponents();
    fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'No orders');
    fixture.componentRef.setInput('description', 'Change the filters or create an order.');
    fixture.componentRef.setInput('actionLabel', 'Create order');
    fixture.detectChanges();
  });

  it('renders a polite named status with configurable content', () => {
    const state = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(state.getAttribute('role')).toBe('status');
    expect(state.getAttribute('aria-label')).toBe('No orders');
    expect(state.textContent).toContain('Change the filters');
  });

  it('emits its optional action', () => {
    let triggered = false;
    fixture.componentInstance.actionTriggered.subscribe(() => (triggered = true));

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(triggered).toBeTrue();
  });
});
