import { AccessRule } from '@sebkuw/shared-ui-core';

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  level: number;
  route?: string;
  expanded?: boolean;
  children?: MenuItem[];
  access?: AccessRule;
  ariaLabel?: string;
}
