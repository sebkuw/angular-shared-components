import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionLinkComponent } from './action-link';

@Component({
  standalone: true,
  imports: [ActionLinkComponent],
  template: `
    <a sharedActionLink href="#target" [disabled]="disabled" (click)="activate()"> Go to target </a>
  `,
})
class ActionLinkHostComponent {
  disabled = false;
  activations = 0;

  activate(): void {
    this.activations += 1;
  }
}

describe('ActionLinkComponent', () => {
  let fixture: ComponentFixture<ActionLinkHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionLinkHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ActionLinkHostComponent);
    fixture.detectChanges();
  });

  it('keeps native anchor semantics and configured destination', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('#target');
    expect(link.textContent).toContain('Go to target');
  });

  it('blocks disabled pointer and keyboard activation', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    link.click();
    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(fixture.componentInstance.activations).toBe(0);
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
  });
});
