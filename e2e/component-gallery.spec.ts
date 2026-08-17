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
  await page.getByLabel('Search order name').fill('First');
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
  const outlineStyle = await focused.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outlineStyle).not.toBe('none');
});

test('renders themed controls without label overlap and exposes every form field kind', async ({
  page,
}) => {
  const form = page.getByRole('form', { name: 'All field types example form' });
  const firstWrapper = form.locator('.form-field-wrapper').first();
  const geometry = await firstWrapper.evaluate((wrapper) => {
    const label = wrapper.querySelector('.form-label')?.getBoundingClientRect();
    const field = wrapper.querySelector('mat-form-field')?.getBoundingClientRect();
    return { labelBottom: label?.bottom ?? 0, fieldTop: field?.top ?? 0 };
  });

  expect(geometry.labelBottom).toBeLessThan(geometry.fieldTop);
  await expect(form.getByPlaceholder('Enter full name')).toBeVisible();
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

test('edits details and applies the configured table filters', async ({ page }) => {
  await page.getByRole('button', { name: 'Edit order details' }).click();
  const editForm = page.getByRole('form', { name: 'Edit example order details' });
  await expect(editForm).toBeVisible();
  await editForm.getByLabel('Name', { exact: true }).fill('Edited order');
  await page.getByRole('button', { name: 'Save edited order details' }).click();
  await expect(page.getByRole('definition').filter({ hasText: 'Edited order' })).toBeVisible();

  await page.getByRole('button', { name: 'Show filters' }).click();
  await expect(page.getByLabel('Choose category')).toBeVisible();
  await expect(page.getByLabel('Choose status')).toBeVisible();
  await expect(page.getByLabel('Minimum amount')).toBeVisible();
  await expect(page.getByLabel('Created from')).toBeVisible();
  await page.getByLabel('Search order name').fill('Network');
  await expect(
    page.getByRole('table', { name: 'Demo orders' }).getByText('Network upgrade'),
  ).toBeVisible();
  await expect(
    page.getByRole('table', { name: 'Demo orders' }).getByText('First order'),
  ).toHaveCount(0);
});

test('@visual component gallery remains visually stable', async ({ page }) => {
  await expect(page).toHaveScreenshot('component-gallery.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
