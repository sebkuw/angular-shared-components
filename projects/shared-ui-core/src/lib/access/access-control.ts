import {
  AccessRule,
  ClaimPrimitive,
  ClaimRequirement,
  ClaimValue,
  PermissionContext,
} from './access-control.models';

/**
 * Evaluates a provider-agnostic access rule against a permission context.
 * Restricted rules always deny while the context is loading, missing or in error.
 */
export function evaluateAccess(
  rule: AccessRule | null | undefined,
  context: PermissionContext,
): boolean {
  if (!rule) {
    return false;
  }

  const hasPermissionRule =
    rule.any !== undefined || rule.all !== undefined || rule.none !== undefined;
  const hasClaimRule = rule.claims !== undefined;

  if (rule.public === true && !hasPermissionRule && !hasClaimRule) {
    return true;
  }

  if (context.status !== 'ready' || !context.authenticated) {
    return false;
  }

  if (!hasPermissionRule && !hasClaimRule) {
    return false;
  }

  const permissions = new Set(context.permissions);

  if (rule.none?.some((permission) => permissions.has(permission))) {
    return false;
  }

  if (rule.any !== undefined) {
    if (rule.any.length === 0) {
      return false;
    }

    if (!rule.any.some((permission) => permissions.has(permission))) {
      return false;
    }
  }

  if (rule.all && !rule.all.every((permission) => permissions.has(permission))) {
    return false;
  }

  if (rule.claims !== undefined) {
    if (rule.claims.length === 0) {
      return false;
    }

    const results = rule.claims.map((requirement) =>
      evaluateClaimRequirement(requirement, context.claims),
    );

    const claimsAllowed =
      rule.claimsLogic === 'any' ? results.some(Boolean) : results.every(Boolean);

    if (!claimsAllowed) {
      return false;
    }
  }

  return true;
}

export function evaluateClaimRequirement(
  requirement: ClaimRequirement,
  claims: Readonly<Record<string, ClaimValue>>,
): boolean {
  const hasClaim = Object.prototype.hasOwnProperty.call(claims, requirement.claim);
  const mode = requirement.match ?? 'any';

  if (mode === 'exists') {
    return hasClaim;
  }

  if (!hasClaim) {
    return mode === 'none';
  }

  const expectedValues = requirement.values ?? [];
  const actualValues = normalizeClaimValue(claims[requirement.claim]);

  if (mode === 'none') {
    return expectedValues.every((value) => !actualValues.includes(value));
  }

  if (expectedValues.length === 0) {
    return false;
  }

  return mode === 'all'
    ? expectedValues.every((value) => actualValues.includes(value))
    : expectedValues.some((value) => actualValues.includes(value));
}

function normalizeClaimValue(value: ClaimValue | undefined): readonly ClaimPrimitive[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value as ClaimPrimitive];
}
