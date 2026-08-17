import { DynamicDetailsComponent } from './dynamic-details';

describe('DynamicDetailsComponent', () => {
  it('returns empty value when field key is missing in data', () => {
    const component = new DynamicDetailsComponent();

    component.data = { name: 'Anna' };

    expect(component.getFieldValue({ key: 'email', label: 'Email' })).toBe('');
  });

  it('uses field render function when provided', () => {
    const component = new DynamicDetailsComponent();

    component.data = { active: true };

    expect(
      component.getFieldValue({
        key: 'active',
        label: 'Status',
        render: (value) => (value ? 'Active' : 'Inactive'),
      }),
    ).toBe('Active');
  });

  it('emits edit and remove events', () => {
    const component = new DynamicDetailsComponent();
    let editCount = 0;
    let removeCount = 0;

    component.edit.subscribe(() => editCount++);
    component.remove.subscribe(() => removeCount++);

    component.onEditClick();
    component.onRemoveClick();

    expect(editCount).toBe(1);
    expect(removeCount).toBe(1);
  });
});
