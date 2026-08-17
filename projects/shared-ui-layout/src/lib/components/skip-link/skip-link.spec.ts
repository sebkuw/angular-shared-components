import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkipLinkComponent } from './skip-link';

@Component({
  standalone: true,
  imports: [SkipLinkComponent],
  template: `
    <shared-skip-link targetId="content" label="Przejdź do treści" />
    <main id="content">Content</main>
  `,
})
class SkipLinkHostComponent {}

describe('SkipLinkComponent', () => {
  let fixture: ComponentFixture<SkipLinkHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SkipLinkHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SkipLinkHostComponent);
    fixture.detectChanges();
  });

  it('renders a native fragment link with a configurable label', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('#content');
    expect(link.textContent).toContain('Przejdź do treści');
  });

  it('moves keyboard focus to the target content', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const target = fixture.nativeElement.querySelector('main') as HTMLElement;

    link.click();

    expect(target.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(target);
  });

  it('does not access or mutate the DOM while rendering on the server', () => {
    const target = document.createElement('main');
    target.id = 'server-content';
    document.body.appendChild(target);
    const component = new SkipLinkComponent(document, 'server');
    component.targetId = 'server-content';

    component.focusTarget();

    expect(target.hasAttribute('tabindex')).toBeFalse();
    target.remove();
  });
});
