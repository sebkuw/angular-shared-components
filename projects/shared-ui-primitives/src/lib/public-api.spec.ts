import {
  ActionBarComponent,
  ActionLinkComponent,
  BadgeComponent,
  ButtonComponent,
  FieldLabelComponent,
  IconComponent,
  IconButtonComponent,
  IconLinkComponent,
  InlineAlertComponent,
  LoadingComponent,
  PopoverComponent,
  PopoverTriggerDirective,
  ProgressComponent,
  provideSharedIcons,
  SHARED_ICON_REGISTRY,
  SkeletonComponent,
  VisuallyHiddenDirective,
} from '@sebkuw/shared-ui-primitives';

describe('shared-ui-primitives public API', () => {
  it('exports all public primitive components through the package entry point', () => {
    expect(ButtonComponent).toBeDefined();
    expect(ActionLinkComponent).toBeDefined();
    expect(IconLinkComponent).toBeDefined();
    expect(ActionBarComponent).toBeDefined();
    expect(IconComponent).toBeDefined();
    expect(IconButtonComponent).toBeDefined();
    expect(FieldLabelComponent).toBeDefined();
    expect(LoadingComponent).toBeDefined();
    expect(InlineAlertComponent).toBeDefined();
    expect(SkeletonComponent).toBeDefined();
    expect(BadgeComponent).toBeDefined();
    expect(ProgressComponent).toBeDefined();
    expect(PopoverComponent).toBeDefined();
    expect(PopoverTriggerDirective).toBeDefined();
    expect(VisuallyHiddenDirective).toBeDefined();
    expect(SHARED_ICON_REGISTRY).toBeDefined();
    expect(provideSharedIcons).toBeDefined();
  });
});
