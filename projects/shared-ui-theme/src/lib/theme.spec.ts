import { NETDEVS_SHARED_UI_THEME_CLASS } from './theme';

describe('NETDEVS_SHARED_UI_THEME_CLASS', () => {
  it('exposes a stable root theme class', () => {
    expect(NETDEVS_SHARED_UI_THEME_CLASS).toBe('netdevs-shared-ui-theme');
  });
});
