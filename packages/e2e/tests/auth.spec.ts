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

test.describe('Authentication flow', () => {
  test('redirects unauthenticated user from /en/products to /en/login', async ({ page }) => {
    await page.goto('/en/products');
    await expect(page).toHaveURL(/\/en\/login\?callbackUrl=%2Fen%2Fproducts/);
  });

  test('logs in with valid credentials and redirects to callbackUrl', async ({
    page,
    browserName: _browserName,
  }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);

    // Navigate to a protected page to trigger redirect
    await page.goto('/en/products');
    await expect(page).toHaveURL(/\/en\/login/);

    // Fill in credentials
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.click('[type="submit"]');

    // Should redirect back to /en/products after login
    await expect(page).toHaveURL('/en/products', { timeout: 10000 });
  });

  test('shows error message for invalid credentials', async ({ page }, testInfo) => {
    const { email } = getCredentials(testInfo.project.name);

    await page.goto('/en/login');

    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('[type="submit"]');

    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[role="alert"]')).toContainText('Invalid email or password');
  });

  test('logout clears session and redirects to login on protected route', async ({
    page,
  }, testInfo) => {
    const { email, password } = getCredentials(testInfo.project.name);

    // Login first
    await page.goto('/en/login');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/en/products', { timeout: 10000 });

    // Logout via API
    await page.request.post('/api/auth/logout');

    // Navigate to protected route — should redirect to login
    await page.goto('/en/products');
    await expect(page).toHaveURL(/\/en\/login/);
  });
});
