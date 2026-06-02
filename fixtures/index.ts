import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { BookPage } from '@/pages/BookPage';
import { test as base } from '@playwright/test';
import { AuthAPI } from './BaseAPI';

type MyFixtures = {
    loginPage: LoginPage;
    registerPage: RegisterPage;
    api: AuthAPI;
    booksPage: BookPage;
}

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    api: async ({ request }, use) => {
        await use(new AuthAPI(request));
    },
    booksPage: async ({ page }, use) => {
        await use(new BookPage(page));
    }
})

export { expect } from '@playwright/test';