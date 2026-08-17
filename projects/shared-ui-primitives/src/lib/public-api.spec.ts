import {
  ButtonComponent,
  FieldLabelComponent,
  IconButtonComponent,
  InlineAlertComponent,
  LoadingComponent,
} from '@sebkuw/shared-ui-primitives';

describe('shared-ui-primitives public API', () => {
  it('exports all public primitive components through the package entry point', () => {
    expect(ButtonComponent).toBeDefined();
    expect(IconButtonComponent).toBeDefined();
    expect(FieldLabelComponent).toBeDefined();
    expect(LoadingComponent).toBeDefined();
    expect(InlineAlertComponent).toBeDefined();
  });
});
