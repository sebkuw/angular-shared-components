import {
  EMPTY_PERMISSION_CONTEXT,
  PermissionContext,
  PUBLIC_ACCESS_RULE,
} from './access-control.models';
import { evaluateAccess, evaluateClaimRequirement } from './access-control';

describe('access control', () => {
  const readyContext: PermissionContext = {
    status: 'ready',
    authenticated: true,
    permissions: ['orders.read', 'orders.edit', 'profile.read'],
    claims: {
      tenant: 'north',
      roles: ['admin', 'reviewer'],
      level: 3,
      enabled: true,
    },
  };

  it('allows only explicitly public resources without a ready context', () => {
    expect(evaluateAccess(PUBLIC_ACCESS_RULE, EMPTY_PERMISSION_CONTEXT)).toBeTrue();
    expect(evaluateAccess(undefined, readyContext)).toBeFalse();
    expect(evaluateAccess({}, readyContext)).toBeFalse();
  });

  it('denies restricted resources for loading, error and anonymous contexts', () => {
    const rule = { all: ['orders.read'] };

    expect(evaluateAccess(rule, EMPTY_PERMISSION_CONTEXT)).toBeFalse();
    expect(evaluateAccess(rule, { ...readyContext, status: 'error' })).toBeFalse();
    expect(evaluateAccess(rule, { ...readyContext, authenticated: false })).toBeFalse();
  });

  it('evaluates any, all and deny-precedence none rules', () => {
    expect(evaluateAccess({ any: ['missing', 'orders.read'] }, readyContext)).toBeTrue();
    expect(evaluateAccess({ all: ['orders.read', 'orders.edit'] }, readyContext)).toBeTrue();
    expect(evaluateAccess({ any: [] }, readyContext)).toBeFalse();
    expect(
      evaluateAccess({ all: ['orders.read'], none: ['orders.edit'] }, readyContext),
    ).toBeFalse();
  });

  it('evaluates typed claim values with all, any, none and exists matching', () => {
    expect(
      evaluateClaimRequirement(
        { claim: 'roles', values: ['admin', 'reviewer'], match: 'all' },
        readyContext.claims,
      ),
    ).toBeTrue();
    expect(
      evaluateClaimRequirement({ claim: 'level', values: [3], match: 'any' }, readyContext.claims),
    ).toBeTrue();
    expect(
      evaluateClaimRequirement(
        { claim: 'roles', values: ['blocked'], match: 'none' },
        readyContext.claims,
      ),
    ).toBeTrue();
    expect(
      evaluateClaimRequirement({ claim: 'enabled', match: 'exists' }, readyContext.claims),
    ).toBeTrue();
  });

  it('aggregates claim rules independently from permission rules', () => {
    expect(
      evaluateAccess(
        {
          all: ['orders.read'],
          claims: [
            { claim: 'tenant', values: ['south'] },
            { claim: 'roles', values: ['admin'] },
          ],
          claimsLogic: 'any',
        },
        readyContext,
      ),
    ).toBeTrue();
  });
});
