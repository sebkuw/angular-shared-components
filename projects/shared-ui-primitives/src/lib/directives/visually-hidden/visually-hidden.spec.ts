import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisuallyHiddenDirective } from './visually-hidden';

@Component({
  standalone: true,
  imports: [VisuallyHiddenDirective],
  template: '<span sharedVisuallyHidden>Additional context</span>',
})
class VisuallyHiddenHostComponent {}

describe('VisuallyHiddenDirective', () => {
  let fixture: ComponentFixture<VisuallyHiddenHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisuallyHiddenHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(VisuallyHiddenHostComponent);
    fixture.detectChanges();
  });

  it('keeps content in the DOM while visually clipping it', () => {
    const content = fixture.nativeElement.querySelector('span') as HTMLElement;

    expect(content.textContent).toBe('Additional context');
    expect(content.style.position).toBe('absolute');
    expect(content.style.clipPath).toBe('inset(50%)');
    expect(content.hasAttribute('aria-hidden')).toBeFalse();
  });
});
