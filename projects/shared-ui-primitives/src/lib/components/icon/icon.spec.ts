import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon';
import { provideSharedIcons } from './icon.models';

@Component({
  standalone: true,
  imports: [IconComponent],
  template: `
    <shared-icon name="save" [decorative]="false" ariaLabel="Save changes" />
    <shared-icon name="projected"><span class="projected">P</span></shared-icon>
  `,
})
class IconHostComponent {}

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHostComponent],
      providers: [provideSharedIcons({ save: '/icons/save.svg' })],
    }).compileComponents();
    fixture = TestBed.createComponent(IconHostComponent);
    fixture.detectChanges();
  });

  it('resolves a named icon from the application registry', () => {
    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe('/icons/save.svg');
  });

  it('provides a meaningful icon role and accessible name', () => {
    const icon = fixture.nativeElement.querySelector('.shared-icon') as HTMLElement;

    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Save changes');
    expect(icon.hasAttribute('aria-hidden')).toBeFalse();
  });

  it('keeps projected decorative icons out of the accessibility tree', () => {
    const icons = fixture.nativeElement.querySelectorAll('.shared-icon') as NodeListOf<HTMLElement>;

    expect(icons[1].getAttribute('aria-hidden')).toBe('true');
    expect(icons[1].querySelector('.projected')).not.toBeNull();
  });
});
