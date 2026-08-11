import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CanAccessDirective } from './can-access.directive';
import { EMPTY_PERMISSION_CONTEXT, PermissionContext } from './access-control.models';
import { providePermissionContext } from './permission-context.service';

@Component({
  standalone: true,
  imports: [CanAccessDirective],
  template: `
    <p *sharedCanAccess="{ all: ['orders.read'] }; else denied">Allowed</p>
    <ng-template #denied><p class="denied">Denied</p></ng-template>
  `,
})
class AccessHostComponent {}

describe('CanAccessDirective', () => {
  let fixture: ComponentFixture<AccessHostComponent>;
  const context = signal<PermissionContext>(EMPTY_PERMISSION_CONTEXT);

  beforeEach(() => {
    context.set(EMPTY_PERMISSION_CONTEXT);
    TestBed.configureTestingModule({
      imports: [AccessHostComponent],
      providers: [providePermissionContext(context)],
    });
    fixture = TestBed.createComponent(AccessHostComponent);
    fixture.detectChanges();
  });

  it('removes denied content from the DOM and renders the fallback', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Allowed');
    expect(fixture.debugElement.query(By.css('.denied'))).not.toBeNull();
  });

  it('updates rendered content when the permission context changes', () => {
    context.set({
      status: 'ready',
      authenticated: true,
      permissions: ['orders.read'],
      claims: {},
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Allowed');
    expect(fixture.debugElement.query(By.css('.denied'))).toBeNull();
  });
});
