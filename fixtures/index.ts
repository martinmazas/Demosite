import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { BookPage } from '@/pages/BookPage';
import { test as base, APIRequestContext } from '@playwright/test';

type MyFixtures = {
    loginPage: LoginPage;
    registerPage: RegisterPage;
    api: APIRequestContext;
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
        await use(request);
    },
    booksPage: async ({ page }, use) => {
        await use(new BookPage(page));
    }
})

export { expect } from '@playwright/test';