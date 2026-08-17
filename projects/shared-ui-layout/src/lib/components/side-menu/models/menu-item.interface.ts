import { AccessRule } from '@sebkuw/shared-ui-core';
import { BadgeAnnouncement, BadgeTone } from '@sebkuw/shared-ui-primitives';

export interface MenuItemBadge {
  value: string | number;
  tone?: BadgeTone;
  max?: number;
  showZero?: boolean;
  ariaLabel?: string;
  announcement?: BadgeAnnouncement;
}

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
  badge?: MenuItemBadge;
}
