import { InjectionToken, Provider } from '@angular/core';

export type IconSize = 'small' | 'medium' | 'large';

export interface IconDefinition {
  readonly src: string;
}

export type IconRegistry = Readonly<Record<string, string | IconDefinition>>;

export const SHARED_ICON_REGISTRY = new InjectionToken<IconRegistry>('SHARED_ICON_REGISTRY', {
  providedIn: 'root',
  factory: () => ({}),
});

export function provideSharedIcons(icons: IconRegistry): Provider {
  return {
    provide: SHARED_ICON_REGISTRY,
    useValue: icons,
  };
}
