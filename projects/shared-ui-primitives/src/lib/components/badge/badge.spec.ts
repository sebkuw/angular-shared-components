import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(BadgeComponent);
  });

  it('hides empty values and zero by default', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shared-badge')).toBeNull();

    fixture.componentRef.setInput('value', 0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shared-badge')).toBeNull();
  });

  it('caps numeric values and supports accessible announcements', () => {
    fixture.componentRef.setInput('value', 120);
    fixture.componentRef.setInput('max', 99);
    fixture.componentRef.setInput('tone', 'negative');
    fixture.componentRef.setInput('announcement', 'polite');
    fixture.componentRef.setInput('ariaLabel', '120 unread messages');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.shared-badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('99+');
    expect(badge.classList).toContain('shared-badge--negative');
    expect(badge.getAttribute('role')).toBe('status');
    expect(badge.getAttribute('aria-label')).toBe('120 unread messages');
  });

  it('marks an unnamed dot as decorative', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.shared-badge') as HTMLElement;
    expect(badge.classList).toContain('shared-badge--dot');
    expect(badge.getAttribute('aria-hidden')).toBe('true');
  });
});
