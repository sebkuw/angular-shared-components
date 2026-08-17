import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  PermissionContext,
  PermissionService,
  providePermissionContext,
} from '@sebkuw/shared-ui-core';
import { BadgeComponent } from '@sebkuw/shared-ui-primitives';
import { MENU_DATA_TOKEN } from './utils/menu-data.token';
import { SideMenu } from './side-menu';

describe('SideMenu', () => {
  let fixture: ComponentFixture<SideMenu>;

  beforeEach(async () => {
    const context = signal<PermissionContext>({
      status: 'ready',
      authenticated: true,
      permissions: [],
      claims: {},
    });

    await TestBed.configureTestingModule({
      imports: [SideMenu],
      providers: [
        provideRouter([]),
        providePermissionContext(context),
        PermissionService,
        {
          provide: MENU_DATA_TOKEN,
          useValue: [
            {
              id: 'inbox',
              title: 'Inbox',
              icon: 'inbox',
              level: 0,
              route: '/',
              ariaLabel: 'Inbox, 12 unread messages',
              badge: {
                value: 12,
                tone: 'negative',
                ariaLabel: '12 unread messages',
              },
            },
          ],
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenu);
    fixture.componentRef.setInput('collapsed', false);
    fixture.detectChanges();
  });

  it('renders a configured public badge inside a navigation item', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const badge = fixture.debugElement.query(
      (node) => node.componentInstance instanceof BadgeComponent,
    );

    expect(link.getAttribute('aria-label')).toBe('Inbox, 12 unread messages');
    expect(badge).not.toBeNull();
    expect((badge.componentInstance as BadgeComponent).value).toBe(12);
    expect((badge.componentInstance as BadgeComponent).tone).toBe('negative');
  });

  it('keeps the badge rendered when the menu is collapsed', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-badge')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.item-title').classList).toContain(
      'visually-hidden',
    );
  });
});
