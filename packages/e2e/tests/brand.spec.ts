import { expect, test } from '@playwright/test';

/**
 * Returns test credentials based on the current project name.
 */
function getCredentials(projectName: string): { email: string; password: string } {
  const brand = projectName === 'project-b' ? 'project-b' : 'project-a';
  return {
    email: `user@${brand}.com`,
    password: 'password123',
  };
}

/**
 * Helper to login before tests that require authentication.
 */
async function login(
  page: import('@playwright/test').Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/en/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('[type="submit"]');
  await expect(page).toHaveURL('/en/products', { timeout: 10000 });
}

test.describe('Brand-specific rendering — project-a', () => {
  test.skip(({ browserName: _browserName }, testInfo) => {
    return testInfo.project.name !== 'project-a';
  }, 'Only runs on project-a');

  test('renders product cards with vertical layout', async ({ page }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);
    await login(page, email, password);

    // Cards should have the vertical CSS class
    const card = page.locator('article').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveClass(/vertical/);
  });

  test('does not show category tags', async ({ page }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);
    await login(page, email, password);

    // Wait for cards to load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Category tags should not be present
    const categoryTags = page.locator('article').first().locator('[class*="categoryTag"]');
    await expect(categoryTags).toHaveCount(0);
  });
});

test.describe('Brand-specific rendering — project-b', () => {
  test.skip(({ browserName: _browserName }, testInfo) => {
    return testInfo.project.name !== 'project-b';
  }, 'Only runs on project-b');

  test('renders product cards with horizontal layout', async ({ page }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);
    await login(page, email, password);

    // Cards should have the horizontal CSS class
    const card = page.locator('article').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveClass(/horizontal/);
  });

  test('shows category tags', async ({ page }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);
    await login(page, email, password);

    // Wait for cards to load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Category tags should be visible
    const categoryTags = page.locator('article').first().locator('[class*="categoryTag"]');
    await expect(categoryTags).toHaveCount(1);
  });
});
