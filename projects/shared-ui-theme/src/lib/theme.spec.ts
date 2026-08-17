import {
  NETDEVS_SHARED_UI_THEME_CLASS,
  NETDEVS_SHARED_UI_THEME_STYLES,
  NETDEVS_SHARED_UI_THEME_TOKENS,
} from './theme';

describe('NETDEVS_SHARED_UI_THEME_CLASS', () => {
  it('exposes a stable root theme class', () => {
    expect(NETDEVS_SHARED_UI_THEME_CLASS).toBe('netdevs-shared-ui-theme');
  });

  it('exposes a stable stylesheet entry point and semantic token names', () => {
    expect(NETDEVS_SHARED_UI_THEME_STYLES).toBe('@sebkuw/shared-ui-theme/styles/tokens.css');
    expect(NETDEVS_SHARED_UI_THEME_TOKENS.color.focus).toBe('--shared-ui-color-focus');
    expect(NETDEVS_SHARED_UI_THEME_TOKENS.color.warning).toBe('--shared-ui-color-warning');
    expect(NETDEVS_SHARED_UI_THEME_TOKENS.color.successContrast).toBe(
      '--shared-ui-color-success-contrast',
    );
  });
});
