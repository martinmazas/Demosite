import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { test as base, request as playwrightResquest } from '@playwright/test';
import { BaseAPI } from './BaseAPI';

type MyFixtures = {
    loginPage: LoginPage;
    registerPage: RegisterPage;
    api: BaseAPI;
}

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    api: async ({ request }, use) => {
        await use(new BaseAPI(request));
    }
})

export { expect } from '@playwright/test';