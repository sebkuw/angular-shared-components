import { AccessRule } from '@sebkuw/shared-ui-core';
import { ButtonTone } from '@sebkuw/shared-ui-primitives';

export type StateAnnouncement = 'off' | 'polite' | 'assertive';
export type StateHeadingLevel = 2 | 3 | 4;

export interface StateActionConfig {
  readonly label: string;
  readonly ariaLabel?: string;
  readonly tone?: ButtonTone;
  readonly access?: AccessRule;
}

export interface EmptyStateConfig {
  readonly title?: string;
  readonly description?: string;
  readonly iconName?: string;
  readonly iconSrc?: string;
  readonly announcement?: StateAnnouncement;
  readonly action?: StateActionConfig;
}

export interface ErrorStateConfig extends EmptyStateConfig {}
