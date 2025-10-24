import { Locator, Page } from "@playwright/test";
import { BankAccount } from "../models/bank-account";

export class HomePage {
    readonly page: Page;
    readonly userOnboardingDialog: Locator;
    readonly listSkeleton: Locator;
    readonly navTopNotificationsCount: Locator;
    readonly userOnboardingNext: Locator;
    readonly userOnboardingDialogTitle: Locator;
    readonly userOnboardingDialogContent: Locator;
    readonly bankNameInput: Locator;
    readonly accountNumberInput: Locator;
    readonly routingNumberInput: Locator;
    readonly bankAccountSubmit: Locator;
    readonly transactionList: Locator;
    readonly sidenavToggle: Locator;
    readonly sidenavSignout: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userOnboardingDialog = page.locator('[data-test="user-onboarding-dialog"]');
        this.listSkeleton = page.locator('[data-test="list-skeleton"]');
        this.navTopNotificationsCount = page.locator('[data-test="nav-top-notifications-count"]');
        this.userOnboardingNext = page.locator('[data-test="user-onboarding-next"]');
        this.userOnboardingDialogTitle = page.locator('[data-test="user-onboarding-dialog-title"]');
        this.userOnboardingDialogContent = page.locator('[data-test="user-onboarding-dialog-content"]');
        this.bankNameInput = page.locator('#bankaccount-bankName-input');
        this.accountNumberInput = page.locator('#bankaccount-accountNumber-input');
        this.routingNumberInput = page.locator('#bankaccount-routingNumber-input');
        this.bankAccountSubmit = page.locator('[data-test="bankaccount-submit"]');
        this.transactionList = page.locator('[data-test="transaction-list"]');
        this.sidenavToggle = page.locator('[data-test="sidenav-toggle"]');
        this.sidenavSignout = page.locator('[data-test="sidenav-signout"]');
    }

    async waitForOnboardingDialog() {
        await this.userOnboardingDialog.waitFor({ state: 'visible' });
    }

    async clickNextOnboarding() {
        await this.userOnboardingNext.click();
    }

    async fillBankAccountForm(bankAccount: BankAccount) {
        await this.bankNameInput.fill(bankAccount.bankName);
        await this.accountNumberInput.fill(bankAccount.accountNumber);
        await this.routingNumberInput.fill(bankAccount.routingNumber);
    }

    async submitBankAccount() {
        await this.bankAccountSubmit.click();
    }

    async logout(isMobile: boolean = false) {
        if (isMobile) {
            await this.sidenavToggle.click();
        }
        await this.sidenavSignout.click();
    }
}
