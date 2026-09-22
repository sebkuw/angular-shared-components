import {
  AsyncSearchSelectComponent,
  DynamicDetailsComponent,
  DynamicFormComponent,
  FormArrayRepeaterComponent,
  FormArrayRepeaterRowDirective,
  FormCompletionIndicatorComponent,
  FormErrorSummaryComponent,
  FormFieldShellComponent,
  FormInputTextComponent,
  FormRepeaterGroupComponent,
} from '@sebkuw/shared-ui-forms';

describe('shared-ui-forms public API', () => {
  it('exports the reusable form, details and control components', () => {
    expect(DynamicFormComponent).toBeDefined();
    expect(FormFieldShellComponent).toBeDefined();
    expect(FormErrorSummaryComponent).toBeDefined();
    expect(FormCompletionIndicatorComponent).toBeDefined();
    expect(DynamicDetailsComponent).toBeDefined();
    expect(FormInputTextComponent).toBeDefined();
    expect(AsyncSearchSelectComponent).toBeDefined();
    expect(FormArrayRepeaterComponent).toBeDefined();
    expect(FormArrayRepeaterRowDirective).toBeDefined();
    expect(FormRepeaterGroupComponent).toBeDefined();
  });
});
