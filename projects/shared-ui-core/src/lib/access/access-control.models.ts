export type PermissionContextStatus = 'loading' | 'ready' | 'error';

export type ClaimPrimitive = string | number | boolean | null;

export type ClaimValue = ClaimPrimitive | readonly ClaimPrimitive[];

export type ClaimMatchMode = 'exists' | 'any' | 'all' | 'none';

export interface ClaimRequirement {
  readonly claim: string;
  readonly values?: readonly ClaimPrimitive[];
  readonly match?: ClaimMatchMode;
}

export interface AccessRule {
  /** Explicitly marks an unconstrained resource as public. */
  readonly public?: boolean;
  /** At least one permission must be present. An explicit empty collection denies access. */
  readonly any?: readonly string[];
  /** Every permission must be present. An empty collection is neutral. */
  readonly all?: readonly string[];
  /** None of the permissions may be present. This rule has deny precedence. */
  readonly none?: readonly string[];
  /** Claims evaluated independently from permission collections. */
  readonly claims?: readonly ClaimRequirement[];
  /** Aggregation used for claim requirements. Defaults to `all`. */
  readonly claimsLogic?: 'all' | 'any';
}

export interface PermissionContext {
  readonly status: PermissionContextStatus;
  readonly authenticated: boolean;
  readonly permissions: readonly string[];
  readonly claims: Readonly<Record<string, ClaimValue>>;
}

export type InaccessibleBehavior = 'remove' | 'hide' | 'disable';

export const PUBLIC_ACCESS_RULE: AccessRule = Object.freeze({ public: true });

export const DENY_ACCESS_RULE: AccessRule = Object.freeze({ public: false });

export const EMPTY_PERMISSION_CONTEXT: PermissionContext = Object.freeze({
  status: 'loading',
  authenticated: false,
  permissions: Object.freeze([]) as readonly string[],
  claims: Object.freeze({}),
});
