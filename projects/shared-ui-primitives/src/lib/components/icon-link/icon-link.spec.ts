import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideSharedIcons } from '../icon/icon.models';
import { IconLinkComponent } from './icon-link';

@Component({
  standalone: true,
  imports: [IconLinkComponent],
  template: `
    <a sharedIconLink href="#settings" ariaLabel="Open settings" iconName="settings"></a>
  `,
})
class IconLinkHostComponent {}

describe('IconLinkComponent', () => {
  let fixture: ComponentFixture<IconLinkHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconLinkHostComponent],
      providers: [provideSharedIcons({ settings: '/icons/settings.svg' })],
    }).compileComponents();
    fixture = TestBed.createComponent(IconLinkHostComponent);
    fixture.detectChanges();
  });

  it('renders an image-only native link with an accessible name', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const image = link.querySelector('img') as HTMLImageElement;

    expect(link.getAttribute('href')).toBe('#settings');
    expect(link.getAttribute('aria-label')).toBe('Open settings');
    expect(image.getAttribute('src')).toBe('/icons/settings.svg');
  });
});
