import { expect, test } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
const TEST_EMAIL = 'sa_cypress@garrettcolorfull.onmicrosoft.com';
const TEST_PASS = 'TestMore12!@';
const CLERK_DOMAIN = process.env.VANGUARD_URL || 'https://colorfull-vangaurd.vercel.app/';
const AUTH_WAIT = process.env.BASTION_URL || 'https://colorfull-vangaurd.vercel.app/';

test('test', async ({ page }) => {
  // Authentication steps
  await page.goto(CLERK_DOMAIN);
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill(TEST_EMAIL);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('link', { name: 'Use another method' }).click();
  await page.getByRole('button', { name: 'Sign in with your password' }).click();
  await page.getByLabel('Password', { exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill(TEST_PASS);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForURL(AUTH_WAIT);
  await page.context().storageState({ path: authFile });

  // Test steps
  await page.goto(AUTH_WAIT);
  await expect(page.getByTestId('playwright-logo')).toBeVisible();
});