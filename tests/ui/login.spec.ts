import { expect, test } from '@/fixtures';

test.describe('Login', () => {
    test('Login > Valid credentials > Profile page is seen', async ({
        loginPage
    }) => {
        const username: string = process.env.TEST_USERNAME!;
        const passowrd: string = process.env.TEST_PASSWORD!;
        await loginPage.login(username, passowrd);
        await expect(loginPage.findByRole('button', 'Logout')).toBeVisible();
    })
})