import { Locator } from "@playwright/test";

import { Page } from "@playwright/test";
import { UserInfo } from "../models/user-info";

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly rememberMe: Locator;
    readonly submitButton: Locator;
    readonly usernameHelperText: Locator;
    readonly passwordHelperText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.locator('#username');
        this.password = page.locator('#password');
        this.rememberMe = page.locator('[data-test="signin-remember-me"] input');
        this.submitButton = page.locator('[data-test="signin-submit"]');
        this.usernameHelperText = page.locator('#username-helper-text');
        this.passwordHelperText = page.locator('#password-helper-text');
    }

    async goto() {
        await this.page.goto('/signin');
    }

    async login(userData: UserInfo, rememberUser: boolean = false) {
        await this.username.fill(userData.username);
        await this.password.fill(userData.password);
        if (rememberUser) {
            await this.rememberMe.check();
        }
        await this.submitButton.click();
    }


    async fillUsername(username: string) {
        await this.username.fill(username);
        await this.username.clear();
        await this.username.blur();
    }

    async fillPassword(password: string) {
        await this.password.fill(password);
        await this.password.blur();
    }
}