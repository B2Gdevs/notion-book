import { expect, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
const TEST_EMAIL = 'sa_cypress@garrettcolorfull.onmicrosoft.com';
const TEST_PASS = 'TestMore12!@';
const CLERK_DOMAIN = 'https://close-ringtail-1.accounts.dev/sign-in';
const AUTH_WAIT = 'https://colorfull-vangaurd.vercel.app/';

setup('authenticate', async ({ page }) => {
	// await page.goto(process.env.CLERK_DOMAIN || '');
	await page.goto(CLERK_DOMAIN);
	await page.getByLabel('Email address').click();
	await page.getByLabel('Email address').fill(TEST_EMAIL);
	await page.getByRole('button', { name: 'Continue', exact: true }).click();
	await page.getByRole('link', { name: 'Use another method' }).click();
	await page
		.getByRole('button', { name: 'Sign in with your password' })
		.click();
	await page.getByLabel('Password', { exact: true }).click();
	await page
		.getByLabel('Password', { exact: true })
		.fill(TEST_PASS);
	await page.getByRole('button', { name: 'Continue' }).click();
	// Wait until the page receives the cookies.
	//
	// Sometimes login flow sets cookies in the process of several redirects.
	// Wait for the final URL to ensure that the cookies are actually set.
	await page.waitForURL(AUTH_WAIT);
	// await page.waitForURL('http://localhost:3000/');
	// Alternatively, you can wait until the page reaches a state where all cookies are set.
	// await expect(page.getByText('Home')).toBeVisible();

	// End of authentication steps.

	await page.context().storageState({ path: authFile });
});
