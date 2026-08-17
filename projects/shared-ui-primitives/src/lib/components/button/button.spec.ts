import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AccessRule, PermissionContext, providePermissionContext } from '@sebkuw/shared-ui-core';
import { ButtonComponent } from './button';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <shared-button
      tone="positive"
      appearance="outlined"
      iconSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
      ariaLabel="Save order"
      ariaDescribedBy="save-help"
      [disabled]="disabled"
      [loading]="loading"
      [access]="access"
      [inaccessibleBehavior]="inaccessibleBehavior"
      (activated)="activationCount = activationCount + 1"
    >
      Save
    </shared-button>
    <span id="save-help">Saves current order</span>
  `,
})
class ButtonHostComponent {
  disabled = false;
  loading = false;
  access: AccessRule = { public: true };
  inaccessibleBehavior: 'remove' | 'hide' | 'disable' = 'remove';
  activationCount = 0;
}

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <shared-button appearance="text" ariaLabel="Projected save">
      <span sharedButtonIcon data-testid="projected-button-icon">★</span>
      Projected icon
    </shared-button>
  `,
})
class ProjectedButtonHostComponent {}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonHostComponent>;
  let host: ButtonHostComponent;
  let permissionContext: ReturnType<typeof signal<PermissionContext>>;

  beforeEach(async () => {
    permissionContext = signal<PermissionContext>({
      status: 'ready',
      authenticated: true,
      permissions: [],
      claims: {},
    });

    await TestBed.configureTestingModule({
      imports: [ButtonHostComponent, ProjectedButtonHostComponent],
      providers: [providePermissionContext(permissionContext)],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a native configured text and image button', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const image = button.querySelector('img') as HTMLImageElement;

    expect(button.type).toBe('button');
    expect(button.textContent).toContain('Save');
    expect(button.getAttribute('aria-label')).toBe('Save order');
    expect(button.getAttribute('aria-describedby')).toBe('save-help');
    expect(button.classList).toContain('shared-button--positive');
    expect(button.classList).toContain('shared-button--outlined');
    expect(image.getAttribute('src')).toContain('data:image/svg+xml');
    expect(image.alt).toBe('');
  });

  it('emits activation and exposes native keyboard semantics', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(host.activationCount).toBe(1);
    expect(button.tagName).toBe('BUTTON');
  });

  it('does not activate while disabled or loading and announces loading', () => {
    host.disabled = true;
    fixture.detectChanges();
    let button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(host.activationCount).toBe(0);
    expect(button.disabled).toBeTrue();

    host.disabled = false;
    host.loading = true;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBeTrue();
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-label')).toBe('Loading');
  });

  it('reactively disables denied actions and enables them after permission changes', () => {
    host.access = { all: ['orders.write'] };
    host.inaccessibleBehavior = 'disable';
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('button') as HTMLButtonElement).disabled,
    ).toBeTrue();

    permissionContext.set({
      status: 'ready',
      authenticated: true,
      permissions: ['orders.write'],
      claims: {},
    });
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('button') as HTMLButtonElement).disabled,
    ).toBeFalse();
  });

  it('honors loading context, any, none and typed claim rules', () => {
    host.access = { any: ['orders.write', 'orders.approve'] };
    permissionContext.set({
      status: 'loading',
      authenticated: true,
      permissions: ['orders.write'],
      claims: { tenant: 'acme' },
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    permissionContext.set({
      status: 'ready',
      authenticated: true,
      permissions: ['orders.write'],
      claims: { tenant: 'acme' },
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();

    host.access = { none: ['orders.write'] };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    host.access = {
      claims: [{ claim: 'tenant', values: ['acme'], match: 'all' }],
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
  });

  it('removes or hides denied actions according to configuration', () => {
    host.access = { all: ['orders.delete'] };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    host.inaccessibleBehavior = 'hide';
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('button') as HTMLButtonElement).hidden).toBeTrue();
  });

  it('supports programmatic focus for available actions', () => {
    const component = fixture.debugElement.query(By.directive(ButtonComponent))
      .componentInstance as ButtonComponent;

    component.focus();

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('button'));
  });

  it('projects a custom icon separately from the visible label', () => {
    const projectedFixture = TestBed.createComponent(ProjectedButtonHostComponent);
    projectedFixture.detectChanges();
    const projectedButton = projectedFixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;

    expect(projectedButton.querySelector('[data-testid="projected-button-icon"]')).not.toBeNull();
    expect(projectedButton.querySelector('.shared-button__label')?.textContent).toContain(
      'Projected icon',
    );
  });
});
