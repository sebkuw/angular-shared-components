import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessRule } from '@sebkuw/shared-ui-core';
import { InlineAlertComponent } from './inline-alert';

@Component({
  standalone: true,
  imports: [InlineAlertComponent],
  template: `
    <shared-inline-alert
      tone="warning"
      title="Check values"
      statusLabel="Attention"
      [announcement]="announcement"
      actionLabel="Review"
      [actionAccess]="actionAccess"
      [dismissible]="true"
      (actionTriggered)="actions = actions + 1"
      (dismissed)="dismissals = dismissals + 1"
    >
      Two fields require attention.
    </shared-inline-alert>
  `,
})
class AlertHostComponent {
  actions = 0;
  dismissals = 0;
  announcement: 'polite' | 'assertive' | 'off' = 'polite';
  actionAccess: AccessRule = { public: true };
}

describe('InlineAlertComponent', () => {
  let fixture: ComponentFixture<AlertHostComponent>;
  let host: AlertHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AlertHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(AlertHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a visible non-color status and polite live region', () => {
    const alert = fixture.nativeElement.querySelector('.shared-inline-alert') as HTMLElement;

    expect(alert.getAttribute('role')).toBe('status');
    expect(alert.getAttribute('aria-live')).toBe('polite');
    expect(alert.textContent).toContain('Attention');
    expect(alert.textContent).toContain('Check values');
    expect(alert.textContent).toContain('Two fields require attention.');
  });

  it('emits action and dismiss events from accessible native buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(2);
    buttons[0].click();
    buttons[1].click();

    expect(host.actions).toBe(1);
    expect(host.dismissals).toBe(1);
    expect(buttons[1].getAttribute('aria-label')).toBe('Dismiss alert');
  });

  it('uses an assertive alert role only when explicitly configured', () => {
    host.announcement = 'assertive';
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.shared-inline-alert') as HTMLElement;
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.getAttribute('aria-live')).toBe('assertive');
  });

  it('removes a denied action while preserving the message and dismiss control', () => {
    host.actionAccess = { all: ['alerts.review'] };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Two fields require attention.');
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(1);
    expect(
      (fixture.nativeElement.querySelector('button') as HTMLButtonElement).getAttribute(
        'aria-label',
      ),
    ).toBe('Dismiss alert');
  });
});
