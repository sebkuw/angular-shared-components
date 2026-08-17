import {
  DynamicDetailsComponent,
  DynamicFormComponent,
  FormCompletionIndicatorComponent,
  FormErrorSummaryComponent,
  FormFieldShellComponent,
  FormInputTextComponent,
} from '@sebkuw/shared-ui-forms';

describe('shared-ui-forms public API', () => {
  it('exports the reusable form, details and control components', () => {
    expect(DynamicFormComponent).toBeDefined();
    expect(FormFieldShellComponent).toBeDefined();
    expect(FormErrorSummaryComponent).toBeDefined();
    expect(FormCompletionIndicatorComponent).toBeDefined();
    expect(DynamicDetailsComponent).toBeDefined();
    expect(FormInputTextComponent).toBeDefined();
  });
});
