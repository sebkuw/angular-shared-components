import {
  CanAccessDirective,
  PermissionService,
  evaluateAccess,
  providePermissionContext,
} from '@netdevs/shared-ui-core';

describe('shared-ui-core public API', () => {
  it('exports access-control primitives through the package entry point', () => {
    expect(CanAccessDirective).toBeDefined();
    expect(PermissionService).toBeDefined();
    expect(evaluateAccess).toBeDefined();
    expect(providePermissionContext).toBeDefined();
  });
});
