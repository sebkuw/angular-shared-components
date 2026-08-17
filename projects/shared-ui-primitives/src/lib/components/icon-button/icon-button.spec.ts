import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { IconButtonComponent } from './icon-button';

@Component({
  standalone: true,
  imports: [IconButtonComponent],
  template: `
    <shared-icon-button ariaLabel="Projected icon action">
      <span data-testid="projected-icon">★</span>
    </shared-icon-button>
  `,
})
class ProjectedIconHostComponent {}

describe('IconButtonComponent', () => {
  let fixture: ComponentFixture<IconButtonComponent>;
  let component: IconButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonComponent, ProjectedIconHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'iconSrc',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
    );
    fixture.componentRef.setInput('ariaLabel', 'Refresh results');
    fixture.componentRef.setInput('ariaControls', 'results-panel');
    fixture.componentRef.setInput('ariaExpanded', false);
    fixture.detectChanges();
  });

  it('renders only a decorative image inside an accessibly named native button', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const image = button.querySelector('img') as HTMLImageElement;

    expect(button.getAttribute('aria-label')).toBe('Refresh results');
    expect(button.getAttribute('aria-controls')).toBe('results-panel');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.textContent?.trim()).toBe('');
    expect(image.src).toContain('data:image/svg+xml');
    expect(image.alt).toBe('');
  });

  it('emits once for an available action and never while disabled', () => {
    let activations = 0;
    component.activated.subscribe(() => activations++);
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();
    component.disabled = true;
    fixture.detectChanges();
    button.click();

    expect(activations).toBe(1);
  });

  it('replaces the image with an announced loading state', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingLabel', 'Refreshing results');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
    expect(button.getAttribute('aria-label')).toBe('Refreshing results');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('img')).toBeNull();
  });

  it('renders a denied action as disabled without emitting', () => {
    let activations = 0;
    component.activated.subscribe(() => activations++);
    fixture.componentRef.setInput('access', { all: ['orders.refresh'] });
    fixture.componentRef.setInput('inaccessibleBehavior', 'disable');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
    button.click();
    expect(activations).toBe(0);
  });

  it('supports a projected icon without requiring an image source', async () => {
    const projectedFixture = TestBed.createComponent(ProjectedIconHostComponent);
    projectedFixture.detectChanges();

    const button = projectedFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Projected icon action');
    expect(button.querySelector('[data-testid="projected-icon"]')).not.toBeNull();
    expect(button.querySelector('img')).toBeNull();
  });
});
