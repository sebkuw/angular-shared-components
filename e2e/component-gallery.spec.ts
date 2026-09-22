import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      runtimeErrors.push(message.text());
    }
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(runtimeErrors).toEqual([]);
});

test('reactively filters permission-protected controls', async ({ page }) => {
  await expect(page.getByLabel('Admin comment')).toHaveCount(0);
  await expect(page.getByText('Admin note')).toHaveCount(0);

  await page.getByRole('button', { name: 'Enable admin permission' }).click();

  await expect(page.getByLabel('Admin comment')).toBeVisible();
  await expect(page.getByText('Admin note')).toBeVisible();
});

test('supports keyboard navigation, sorting and dialogs', async ({ page }) => {
  await page.getByLabel('Name, not sorted').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('th[aria-sort="ascending"]')).toBeVisible();

  await page.getByRole('button', { name: 'Open gallery information' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('hosts an asynchronous form modal with validation, focus and keyboard closing', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Open supplier assignment form' });
  await trigger.click();

  let dialog = page.getByRole('dialog', { name: 'Assign user to supplier' });
  const supplier = dialog.getByRole('combobox', { name: 'Supplier' });
  const submit = dialog.getByRole('button', { name: 'Assign user' });
  await expect(dialog).toBeVisible();
  await expect(supplier).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(submit).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(supplier).toBeFocused();

  await submit.click();
  await expect(dialog.getByRole('alert')).toContainText(
    'Choose a supplier before assigning the user.',
  );

  await supplier.selectOption('Acme Furniture');
  await submit.click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('#assignment-status')).toContainText(
    'User assigned to Acme Furniture.',
  );

  await trigger.click();
  dialog = page.getByRole('dialog', { name: 'Assign user to supplier' });
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('reflows without horizontal page overflow at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});

test('exposes accessible names and announces notifications', async ({ page }) => {
  await expect(page.getByRole('navigation', { name: 'Demo navigation' })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Demo orders' })).toBeVisible();

  for (const button of await page.getByRole('button').all()) {
    await expect(button).not.toHaveAccessibleName('');
  }

  await page.getByRole('button', { name: 'Show notification' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'The notification is announced by a live region.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Dismiss example notification' })).toBeVisible();
});

test('demonstrates every public primitive and its interactions', async ({ page }) => {
  const primitives = page.getByRole('region', { name: 'Public UI primitives' });

  await expect(primitives.getByRole('button', { name: 'Save changes' })).toBeVisible();
  await expect(primitives.getByRole('button', { name: 'Remove item' })).toBeVisible();
  await expect(primitives.getByRole('button', { name: 'Save with image' })).toBeVisible();
  await expect(
    primitives.getByRole('button', { name: 'Refresh primitive examples' }),
  ).toBeVisible();
  await expect(primitives.getByLabel('Visible order reference label')).toBeVisible();
  await expect(primitives.getByRole('status', { name: 'Loading primitive example' })).toBeVisible();
  await expect(primitives.getByRole('progressbar', { name: 'Profile setup' })).toHaveAttribute(
    'value',
    '68',
  );
  await expect(primitives.getByRole('status', { name: 'Loading order preview' })).toBeVisible();
  await expect(primitives.getByText('Unread updates')).toContainText('3');

  await primitives.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator('#primitive-action-status')).toContainText('Positive Save action');

  await primitives.getByRole('button', { name: 'Refresh primitive examples' }).click();
  await expect(page.locator('#primitive-action-status')).toContainText('Icon-only Refresh action');

  await primitives.getByRole('button', { name: 'Review' }).click();
  await expect(page.locator('#primitive-action-status')).toContainText(
    'Inline alert Review action',
  );
  await primitives.getByRole('button', { name: 'Dismiss primitive warning' }).click();
  await expect(primitives.getByText('Check the values')).toHaveCount(0);
  await expect(primitives.getByRole('alert').filter({ hasText: 'Could not save' })).toBeVisible();
});

test('uses public action primitives throughout the integrated libraries', async ({ page }) => {
  await expect(page.locator('shared-page-header shared-icon-button')).toHaveCount(1);
  await expect(page.locator('shared-dynamic-details shared-icon-button')).toHaveCount(2);
  await expect(page.locator('shared-dynamic-form shared-button')).not.toHaveCount(0);
  await expect(page.locator('shared-dynamic-form shared-icon-button')).not.toHaveCount(0);
  await expect(page.locator('shared-dynamic-table shared-icon-button')).not.toHaveCount(0);

  await page.getByRole('button', { name: 'Show filters' }).click();
  await page
    .getByRole('form', { name: 'Show filters' })
    .getByLabel('Name', { exact: true })
    .fill('First');
  const clearFilters = page.locator('shared-dynamic-table').getByRole('button', {
    name: 'Clear filters',
  });
  await expect(clearFilters).toBeVisible();
  await clearFilters.click();
  await expect(clearFilters).toHaveCount(0);

  await page.getByRole('button', { name: 'Show notification' }).click();
  await expect(page.locator('shared-notification shared-icon-button')).toHaveCount(1);
});

test('keeps public primitives usable with RTL and 320px reflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.locator('.demo-shell').evaluate((shell) => shell.setAttribute('dir', 'rtl'));

  const primitives = page.getByRole('region', { name: 'Public UI primitives' });
  await expect(
    primitives.getByRole('button', { name: 'Refresh primitive examples' }),
  ).toBeVisible();
  await expect(primitives.getByText('A deliberately long translated message')).toBeVisible();

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});

test('keeps a visible focus indicator for keyboard users', async ({ page }) => {
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();
  await expect(focused).toHaveAccessibleName('Skip to component gallery');
  const outlineStyle = await focused.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outlineStyle).not.toBe('none');

  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('uses semantic action links, icon registry and a grouped action bar', async ({ page }) => {
  const primitives = page.getByRole('region', { name: 'Public UI primitives' });

  await expect(primitives.getByRole('img', { name: 'Save icon' })).toBeVisible();
  await expect(
    primitives.getByRole('group', { name: 'Primitive navigation examples' }),
  ).toBeVisible();
  await expect(primitives.getByRole('link', { name: 'Go to form examples' })).toHaveAttribute(
    'href',
    '#form-heading',
  );
  await expect(primitives.getByRole('link', { name: 'Go to table examples' })).toHaveAttribute(
    'href',
    '#table-heading',
  );
});

test('renders a configured badge in the navigation menu', async ({ page }) => {
  const overview = page.getByRole('link', { name: 'Overview, 3 unread updates' });

  await expect(overview).toBeVisible();
  await expect(overview.locator('shared-badge')).toContainText('3');
});

test('opens and dismisses the popover with accessible keyboard behavior', async ({ page }) => {
  const trigger = page.getByRole('button', { name: /Notifications 3/ });
  await trigger.focus();
  await page.keyboard.press('Enter');

  const popover = page.getByRole('dialog', { name: 'Notification summary' });
  await expect(popover).toBeVisible();
  await expect(popover).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(popover).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('renders themed controls without label overlap and exposes every form field kind', async ({
  page,
}) => {
  const form = page.getByRole('form', { name: 'All field types example form' });
  const firstWrapper = form.locator('.form-field-wrapper').first();
  const geometry = await firstWrapper.evaluate((wrapper) => {
    const label = wrapper.querySelector('shared-field-label label')?.getBoundingClientRect();
    const field = wrapper.querySelector('mat-form-field')?.getBoundingClientRect();
    return { labelBottom: label?.bottom ?? 0, fieldTop: field?.top ?? 0 };
  });

  expect(geometry.labelBottom).toBeLessThan(geometry.fieldTop);
  await expect(form.getByPlaceholder('Enter full name')).toBeVisible();
  await expect(form.getByRole('combobox', { name: 'Order type', exact: true })).toBeVisible();
  await expect(form.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(form.getByRole('spinbutton', { name: 'Quantity' })).toBeVisible();
  await expect(form.getByRole('button', { name: 'Open calendar' })).toBeVisible();
  await expect(form.getByRole('button', { name: 'Attachment' })).toBeVisible();
  await expect(form.getByRole('button', { name: 'Add line item' })).toBeVisible();
  await expect(form.getByText('Editable line items')).toBeVisible();

  await form.getByLabel('Name', { exact: true }).fill('Alex Morgan');
  await form.getByLabel('Email', { exact: true }).fill('alex@example.com');
  const submit = form.getByRole('button', { name: 'Save all field type examples' });
  await expect(submit).toBeEnabled();
  const submitStyle = await submit.evaluate((button) => {
    const style = getComputedStyle(button);
    return { backgroundColor: style.backgroundColor, borderRadius: parseFloat(style.borderRadius) };
  });
  expect(submitStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(submitStyle.borderRadius).toBeGreaterThanOrEqual(8);
});

test('keeps the labelled select operable with the keyboard', async ({ page }) => {
  const form = page.getByRole('form', { name: 'All field types example form' });
  const select = form.getByRole('combobox', { name: 'Order type', exact: true });

  await select.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox', { name: 'Order type', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox', { name: 'Order type', exact: true })).toHaveCount(0);
  await expect(select).toBeFocused();
});

test('summarizes form errors and reports required-field completion', async ({ page }) => {
  const form = page.getByRole('form', { name: 'All field types example form' });
  const progress = form.getByRole('progressbar', { name: 'Required example fields completed' });

  await expect(progress).toHaveAttribute('value', '0');
  await expect(form.locator('#name')).toHaveAttribute('aria-describedby', /name-hint/);
  await form.getByRole('button', { name: 'Save all field type examples' }).click();

  const summary = form.getByRole('alert').filter({ hasText: 'Complete the example form' });
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  await summary.getByRole('link', { name: /Name:/ }).click();
  await expect(form.getByLabel('Name', { exact: true })).toBeFocused();

  await form.getByLabel('Name', { exact: true }).fill('Alex Morgan');
  await expect(progress).toHaveAttribute('value', '50');
  await form.getByLabel('Email', { exact: true }).fill('alex@example.com');
  await expect(progress).toHaveAttribute('value', '100');
});

test('validates the responsive linear stepper and focuses the first invalid control', async ({
  page,
}) => {
  const wizard = page.getByRole('region', { name: 'Order wizard' });
  const customerName = wizard.getByLabel('Customer name');

  await wizard.getByRole('button', { name: 'Next' }).click();
  await expect(customerName).toBeFocused();
  await expect(customerName).toHaveAttribute('aria-invalid', 'true');

  await customerName.fill('Meblicz customer');
  await wizard.getByRole('button', { name: 'Next' }).click();
  await expect(wizard.getByRole('tab', { name: /Contacts/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await wizard.getByRole('tab', { name: /Contacts/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(wizard.getByRole('tab', { name: /Review/ })).toBeFocused();
});

test('adds accessible repeater cards with stable unique control ids and can remove to zero', async ({
  page,
}) => {
  const wizard = page.getByRole('region', { name: 'Order wizard' });
  await wizard.getByLabel('Customer name').fill('Meblicz customer');
  await wizard.getByRole('button', { name: 'Next' }).click();

  await wizard.getByRole('button', { name: 'Add contact' }).click();
  await expect(wizard.getByLabel('Contact name 1')).toBeFocused();
  await wizard.getByRole('button', { name: 'Add contact' }).click();

  const repeatedControls = wizard.locator(
    'input[id^="demo-contact-row"], textarea[id^="demo-contact-row"]',
  );
  const controlIds = await repeatedControls.evaluateAll((controls) =>
    controls.map((control) => control.id),
  );
  expect(new Set(controlIds).size).toBe(controlIds.length);
  await expect(wizard.getByRole('group', { name: 'Contact details' })).toHaveCount(2);
  await expect(wizard.getByRole('group', { name: 'Address' })).toHaveCount(2);
  await expect(wizard.getByRole('group', { name: 'Preferences' })).toHaveCount(2);

  await wizard.getByRole('button', { name: 'Remove Contact 2' }).click();
  await wizard.getByRole('button', { name: 'Remove Contact 1' }).click();
  await expect(
    wizard.getByText('No contacts added. This optional step can be skipped.'),
  ).toBeVisible();
  await expect(wizard.getByRole('button', { name: 'Add contact' })).toBeFocused();
});

test('stacks stepper and repeater groups at 320px without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const wizard = page.getByRole('region', { name: 'Order wizard' });
  await expect(wizard.locator('mat-stepper')).toHaveClass(/mat-stepper-vertical/);

  await wizard.getByLabel('Customer name').fill('Meblicz customer');
  await wizard.getByRole('button', { name: 'Next' }).click();
  await wizard.getByRole('button', { name: 'Add contact' }).click();

  const gridColumnCount = await wizard
    .locator('.shared-form-array-repeater__groups')
    .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  expect(gridColumnCount).toBe(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test('edits details and applies the configured table filters', async ({ page }) => {
  await page.getByRole('button', { name: 'Edit order details' }).click();
  const editForm = page.getByRole('form', { name: 'Edit example order details' });
  await expect(editForm).toBeVisible();
  await editForm.getByLabel('Name', { exact: true }).fill('Edited order');
  await page.getByRole('button', { name: 'Save edited order details' }).click();
  await expect(page.getByRole('definition').filter({ hasText: 'Edited order' })).toBeVisible();

  await page.getByRole('button', { name: 'Show filters' }).click();
  const filters = page.getByRole('form', { name: 'Show filters' });
  await expect(filters.getByLabel('Category', { exact: true })).toHaveAttribute(
    'placeholder',
    'Search categories',
  );
  await expect(filters.getByLabel('Active', { exact: true })).toBeVisible();
  await expect(filters.getByLabel('Amount From', { exact: true })).toHaveAttribute(
    'placeholder',
    'Minimum amount',
  );
  await expect(filters.getByLabel('Created From', { exact: true })).toHaveAttribute(
    'placeholder',
    'Created from',
  );
  await filters.getByLabel('Category', { exact: true }).fill('soft');
  await expect(filters.getByRole('option', { name: 'Software' })).toBeVisible();
  await filters.getByLabel('Category', { exact: true }).press('Enter');
  await expect(
    page.getByRole('table', { name: 'Demo orders' }).getByText('Developer licences'),
  ).toBeVisible();

  await filters.getByLabel('Category', { exact: true }).fill('hard');
  await expect(filters.getByRole('option', { name: 'Hardware' })).toBeVisible();
  await filters.getByLabel('Category', { exact: true }).press('Enter');
  await filters.getByLabel('Name', { exact: true }).fill('Network');
  await expect(
    page.getByRole('table', { name: 'Demo orders' }).getByText('Network upgrade'),
  ).toBeVisible();
  await expect(
    page.getByRole('table', { name: 'Demo orders' }).getByText('First order'),
  ).toHaveCount(0);
});

test('confirms destructive actions and restores an empty details state', async ({ page }) => {
  await page.getByRole('button', { name: 'Remove order details' }).click();

  const dialog = page.getByRole('dialog', { name: 'Remove order details?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Keep details' })).toBeFocused();
  await dialog.getByRole('button', { name: 'Keep details' }).click();
  await expect(page.getByRole('definition').filter({ hasText: 'First order' })).toBeVisible();

  await page.getByRole('button', { name: 'Remove order details' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove details' }).click();
  const emptyDetails = page.getByRole('status', { name: 'No order details' });
  await expect(emptyDetails).toBeVisible();
  await emptyDetails.getByRole('button', { name: 'Restore details' }).click();
  await expect(page.getByRole('button', { name: 'Remove order details' })).toBeVisible();
});

test('shows empty and error states in the data table', async ({ page }) => {
  await page.getByRole('button', { name: 'Show filters' }).click();
  await page
    .getByRole('form', { name: 'Show filters' })
    .getByLabel('Name', { exact: true })
    .fill('No order has this name');
  await expect(page.getByRole('status', { name: 'No matching orders' })).toBeVisible();

  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByRole('table', { name: 'Demo orders' })).toBeVisible();

  await page.getByRole('button', { name: 'Simulate table error' }).click();
  const errorState = page.getByRole('status', { name: 'Orders unavailable' });
  await expect(errorState).toBeVisible();
  await expect(page.getByRole('table', { name: 'Demo orders' })).toHaveCount(0);
  await errorState.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('table', { name: 'Demo orders' })).toBeVisible();
});

test('@visual component gallery remains visually stable', async ({ page }) => {
  await expect(page).toHaveScreenshot('component-gallery.png', {
    fullPage: true,
    animations: 'disabled',
  });
});

test('@visual form modal remains visually stable', async ({ page }) => {
  await page.getByRole('button', { name: 'Open supplier assignment form' }).click();
  const dialog = page.getByRole('dialog', { name: 'Assign user to supplier' });
  await dialog.getByRole('button', { name: 'Assign user' }).click();

  await expect(dialog).toHaveScreenshot('form-modal.png', { animations: 'disabled' });
});
