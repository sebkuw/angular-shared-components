import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EMPTY_PERMISSION_CONTEXT, PermissionContext } from './access-control.models';
import { PermissionService, providePermissionContext } from './permission-context.service';

describe('PermissionService', () => {
  it('reacts to login, permission refresh and logout through a signal source', () => {
    const context = signal<PermissionContext>(EMPTY_PERMISSION_CONTEXT);

    TestBed.configureTestingModule({
      providers: [providePermissionContext(context)],
    });

    const service = TestBed.inject(PermissionService);
    const rule = { all: ['orders.read'] };

    expect(service.canAccess(rule)).toBeFalse();

    context.set({
      status: 'ready',
      authenticated: true,
      permissions: ['orders.read'],
      claims: {},
    });
    expect(service.canAccess(rule)).toBeTrue();

    context.update((value) => ({ ...value, permissions: [] }));
    expect(service.canAccess(rule)).toBeFalse();

    context.set({ ...EMPTY_PERMISSION_CONTEXT, status: 'ready' });
    expect(service.canAccess(rule)).toBeFalse();
  });
});
