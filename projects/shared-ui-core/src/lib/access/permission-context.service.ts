import { Injectable, InjectionToken, Provider, Signal, inject, signal } from '@angular/core';
import { evaluateAccess } from './access-control';
import { AccessRule, EMPTY_PERMISSION_CONTEXT, PermissionContext } from './access-control.models';

export const PERMISSION_CONTEXT = new InjectionToken<Signal<PermissionContext>>(
  'NETDEVS_SHARED_UI_PERMISSION_CONTEXT',
  {
    providedIn: 'root',
    factory: () => signal<PermissionContext>(EMPTY_PERMISSION_CONTEXT).asReadonly(),
  },
);

export function providePermissionContext(context: Signal<PermissionContext>): Provider {
  return {
    provide: PERMISSION_CONTEXT,
    useValue: context,
  };
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
  readonly context = inject(PERMISSION_CONTEXT);

  canAccess(rule: AccessRule | null | undefined): boolean {
    return evaluateAccess(rule, this.context());
  }
}
