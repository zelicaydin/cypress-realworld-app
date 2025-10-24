import { expect, Page, APIRequestContext } from '@playwright/test';
import { test } from '../fixtures/page-fixtures';
import {userInfoData} from '../data/user-info-data';
import {bankAccountData} from '../data/bank-account-data';
import { findUser, seedDatabase } from '../utils/helpers';
import { API_GRAPHQL, BASE_URL, DEFAULT_PASSWORD } from '../utils/constants';
import { isMobile } from '../utils/helpers';


test.beforeEach(async ({ page, request }) => {
  await seedDatabase(request);
  
  // Set up route handlers
  await page.route('**/users', async route => {
    if (route.request().method() === 'POST') {
      await route.continue();
    }
  });

  await page.route(API_GRAPHQL, async route => {
    const postData = route.request().postDataJSON();
    if (postData?.operationName === 'CreateBankAccount') {
      await route.continue();
    } else {
      await route.continue();
    }
  });
  await page.goto(BASE_URL);
});

test.describe('User Sign-up and Login', () => {
  test('should redirect unauthenticated user to signin page', async ({ page }) => {
    await page.goto('/personal');
    await expect(page).toHaveURL('/signin');
  });

  test('should redirect to the home page after login', async ({ page, request, loginPage }) => {
    const user = await findUser(request);
    user.password = DEFAULT_PASSWORD;
    await loginPage.goto();
    await loginPage.login(user, true);
    await expect(page).toHaveURL('/');
  });

  test('should allow a visitor to sign-up, login, and logout', async ({ page, signupPage, loginPage, homePage }) => {
    const userInfo = userInfoData;

    await signupPage.goto()
    await signupPage.signup(userInfo);

    await loginPage.goto();
    await loginPage.login(userInfo, true);

    // Onboarding
    await expect(homePage.userOnboardingDialog).toBeVisible();
    await expect(homePage.listSkeleton).not.toBeVisible();
    await expect(homePage.navTopNotificationsCount).toBeVisible();
    await homePage.clickNextOnboarding();

    await expect(homePage.userOnboardingDialogTitle).toContainText('Create Bank Account');

    await homePage.fillBankAccountForm(bankAccountData);
    await homePage.submitBankAccount();
    

    await expect(homePage.userOnboardingDialogTitle).toContainText('Finished');
    await expect(homePage.userOnboardingDialogContent).toContainText("You're all set!");
    await homePage.clickNextOnboarding();

    await expect(homePage.transactionList).toBeVisible();

    // Logout User
    await homePage.logout(isMobile(page));
    await expect(page).toHaveURL('/signin');
  });

  test('should display login errors', async ({ page, loginPage }) => {
    await loginPage.goto();

    // Test username required error
    await loginPage.fillUsername('');
    await expect(loginPage.usernameHelperText).toBeVisible();
    await expect(loginPage.usernameHelperText).toContainText('Username is required');

    // Test password length error
    await loginPage.fillPassword('abc');
    await expect(loginPage.passwordHelperText).toBeVisible();
    await expect(loginPage.passwordHelperText).toContainText('Password must contain at least 4 characters');

    // Test submit button disabled
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test('should display signup errors', async ({ page, signupPage }) => {
    await page.goto('/signup');
    signupPage.goto();
    await signupPage.signup(userInfoData);
    // Test first name required
    await page.locator('#firstName').fill('First');
    await page.locator('#firstName').clear();
    await page.locator('#firstName').blur();
    await expect(page.locator('#firstName-helper-text')).toBeVisible();
    await expect(page.locator('#firstName-helper-text')).toContainText('First Name is required');

    // Test last name required
    await page.locator('#lastName').fill('Last');
    await page.locator('#lastName').clear();
    await page.locator('#lastName').blur();
    await expect(page.locator('#lastName-helper-text')).toBeVisible();
    await expect(page.locator('#lastName-helper-text')).toContainText('Last Name is required');

    // Test username required
    await page.locator('#username').fill('User');
    await page.locator('#username').clear();
    await page.locator('#username').blur();
    await expect(page.locator('#username-helper-text')).toBeVisible();
    await expect(page.locator('#username-helper-text')).toContainText('Username is required');

    // Test password required
    await page.locator('#password').fill('password');
    await page.locator('#password').clear();
    await page.locator('#password').blur();
    await expect(page.locator('#password-helper-text')).toBeVisible();
    await expect(page.locator('#password-helper-text')).toContainText('Enter your password');

    // Test password mismatch
    await page.locator('#confirmPassword').fill('DIFFERENT PASSWORD');
    await page.locator('#confirmPassword').blur();
    await expect(page.locator('#confirmPassword-helper-text')).toBeVisible();
    await expect(page.locator('#confirmPassword-helper-text')).toContainText('Password does not match');

    // Test submit button disabled
    await expect(page.getByTestId("signup-submit")).toBeDisabled();
  });

  test('should error for an invalid user', async ({ page, loginPage }) => {
    await loginPage.goto();
    const user = userInfoData;
    user.username = 'invalidUserName';
    user.password = 'invalidPa$$word';
    await loginPage.login(user);

    await expect(page.locator('[data-test="signin-error"]')).toBeVisible();
    await expect(page.locator('[data-test="signin-error"]')).toHaveText('Username or password is invalid');
  });

  test('should error for an invalid password for existing user', async ({ page, request, loginPage   }) => {
    await loginPage.goto();
    const user = await findUser(request);
    user.password = 'INVALID';
    await loginPage.login(user);

    await expect(page.locator('[data-test="signin-error"]')).toBeVisible();
    await expect(page.locator('[data-test="signin-error"]')).toHaveText('Username or password is invalid');
  });
});
