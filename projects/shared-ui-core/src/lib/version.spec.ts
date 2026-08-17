import { NETDEVS_SHARED_UI_VERSION } from './version';

describe('NETDEVS_SHARED_UI_VERSION', () => {
  it('exposes the current package version', () => {
    expect(NETDEVS_SHARED_UI_VERSION).toBe('0.1.0');
  });
});
