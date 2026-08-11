export const NETDEVS_SHARED_UI_THEME_CLASS = 'netdevs-shared-ui-theme';

export const NETDEVS_SHARED_UI_THEME_STYLES = '@netdevs/shared-ui-theme/styles/tokens.css';

export const NETDEVS_SHARED_UI_THEME_TOKENS = {
  color: {
    background: '--shared-ui-color-background',
    surface: '--shared-ui-color-surface',
    text: '--shared-ui-color-text',
    textMuted: '--shared-ui-color-text-muted',
    border: '--shared-ui-color-border',
    primary: '--shared-ui-color-primary',
    primaryContrast: '--shared-ui-color-primary-contrast',
    danger: '--shared-ui-color-danger',
    success: '--shared-ui-color-success',
    info: '--shared-ui-color-info',
    focus: '--shared-ui-color-focus',
  },
  spacing: {
    xSmall: '--shared-ui-spacing-xs',
    small: '--shared-ui-spacing-sm',
    medium: '--shared-ui-spacing-md',
    large: '--shared-ui-spacing-lg',
    xLarge: '--shared-ui-spacing-xl',
  },
  radius: {
    small: '--shared-ui-radius-sm',
    medium: '--shared-ui-radius-md',
    large: '--shared-ui-radius-lg',
  },
  motion: {
    duration: '--shared-ui-motion-duration',
  },
} as const;
