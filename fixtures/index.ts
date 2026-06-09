import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { BookPage } from '@/pages/BookPage';
import { test as base, APIRequestContext } from '@playwright/test';
import { BasePage } from './BasePage';

type MyFixtures = {
    loginPage: LoginPage;
    registerPage: RegisterPage;
    api: APIRequestContext;
    booksPage: BookPage;
    customPage: BasePage;
}

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    api: async ({ request }, use) => {
        await use(request);
    },
    booksPage: async ({ page }, use) => {
        await use(new BookPage(page));
    },
    customPage: async ({ page }, use) => {
        await use(new BasePage(page));
    }
})

export { expect } from '@playwright/test';