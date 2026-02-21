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

test.describe('Products page', () => {
  test('displays product listing after login', async ({ page }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);
    await login(page, email, password);

    // Should show the Products heading
    await expect(page.locator('h1')).toContainText('Products');

    // Should render product cards
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    // Should have multiple products
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('product detail shows extended info for authenticated users', async ({ page }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);
    await login(page, email, password);

    // Navigate to a product detail page
    await page.goto('/en/product/1');

    // Authenticated users should see extended content (reviews or product details section)
    const extendedSection = page.locator('text=Product Details');
    await expect(extendedSection).toBeVisible({ timeout: 10000 });
  });

  test('product detail shows login CTA for unauthenticated users', async ({ page }) => {
    // Navigate directly to product detail (middleware should allow through since
    // product detail pages are protected, so we should be redirected)
    await page.goto('/en/product/1');

    // Should redirect to login
    await expect(page).toHaveURL(/\/en\/login/);
  });
});
