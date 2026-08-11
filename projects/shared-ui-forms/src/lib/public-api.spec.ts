import {
  DynamicDetailsComponent,
  DynamicFormComponent,
  FormInputTextComponent,
} from '@sebkuw/shared-ui-forms';

describe('shared-ui-forms public API', () => {
  it('exports the reusable form, details and control components', () => {
    expect(DynamicFormComponent).toBeDefined();
    expect(DynamicDetailsComponent).toBeDefined();
    expect(FormInputTextComponent).toBeDefined();
  });
});
