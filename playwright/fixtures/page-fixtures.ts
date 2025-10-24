import { LoginPage } from "../pages/login-page";
import { SignupPage } from "../pages/signup-page";
import { HomePage } from "../pages/home-page";
import {test as base} from '@playwright/test';

export type PageFixtures = {
    signupPage: SignupPage;
    loginPage: LoginPage;
    homePage: HomePage;
};

export const test = base.extend<PageFixtures>({
    signupPage: async ({ page }, use) => {
        const signupPage = new SignupPage(page);
        await use(signupPage);
    },
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
});