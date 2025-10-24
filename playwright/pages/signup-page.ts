import { Locator, Page } from "@playwright/test";
import { UserInfo } from "../models/user-info";

export class SignupPage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.username = page.locator('#username');
        this.password = page.locator('#password');
        this.confirmPassword = page.locator('#confirmPassword');
        this.submitButton = page.locator('[data-test="signup-submit"]');
    }

    async goto() {
        await this.page.goto('/signup');
    }

    async signup(userInfo: UserInfo) {
        await this.firstName.fill(userInfo.firstName);
        await this.lastName.fill(userInfo.lastName);
        await this.username.fill(userInfo.username);
        await this.password.fill(userInfo.password);
        await this.confirmPassword.fill(userInfo.password);
        await this.submitButton.click();
    }
}