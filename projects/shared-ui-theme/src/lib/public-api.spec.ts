import {
  NETDEVS_SHARED_UI_THEME_CLASS,
  NETDEVS_SHARED_UI_THEME_TOKENS,
} from '@netdevs/shared-ui-theme';

describe('shared-ui-theme public API', () => {
  it('exports the root class and semantic tokens', () => {
    expect(NETDEVS_SHARED_UI_THEME_CLASS).toBe('netdevs-shared-ui-theme');
    expect(NETDEVS_SHARED_UI_THEME_TOKENS.color.text).toBe('--shared-ui-color-text');
  });
});
