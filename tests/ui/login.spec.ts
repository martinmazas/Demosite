import { expect, test } from '@/fixtures';
import { generateUserData } from '@/functions/testData';
import { saveUser } from '@/functions/userStorage';

test.describe('Login', () => {
    test('Login > Valid credentials > Profile page is seen', async ({
        loginPage
    }) => {
        const username: string = process.env.TEST_USERNAME!;
        const passowrd: string = process.env.TEST_PASSWORD!;
        await loginPage.login(username, passowrd);
        await expect(loginPage.findByRole('button', 'Logout')).toBeVisible();
    })

    test.skip('Register > New user is created', async ({ registerPage }) => {
        const dialogPromise = new Promise<string>(resolve => {
            registerPage.on('dialog', async dialog => {
                const message = dialog.message();
                await dialog.accept();
                resolve(message);
            });
        });

        const { firstName, lastName, username, password } = generateUserData();

        await registerPage.register(firstName, lastName, username, password);
        const dialogMessage = await dialogPromise;
        expect(dialogMessage).toBe('User Registered Successfully.');
        saveUser({ firstName, lastName, username, password });
    })
})