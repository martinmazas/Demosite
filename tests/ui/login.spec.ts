import { expect, test } from '@/fixtures';
import { saveUser } from '@/functions/userStorage';
import { faker } from '@faker-js/faker';

test.describe('Login', () => {
    test('Login > Valid credentials > Profile page is seen', async ({
        loginPage
    }) => {
        const username: string = process.env.TEST_USERNAME!;
        const passowrd: string = process.env.TEST_PASSWORD!;
        await loginPage.login(username, passowrd);
        await expect(loginPage.findByRole('button', 'Logout')).toBeVisible();
    })

    test('Register > New user is created', async ({ registerPage }) => {
        const dialogPromise = new Promise<string>(resolve => {
            registerPage.on('dialog', async dialog => {
                const message = dialog.message();
                await dialog.accept();
                resolve(message);
            });
        });

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = faker.internet.username({ firstName, lastName });
        const password = faker.internet.password({ length: 4, memorable: false, pattern: /[a-z]/ })
            + faker.string.fromCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1)
            + faker.string.fromCharacters('0123456789', 1)
            + faker.string.fromCharacters('!@#$%^&*', 1)
            + faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 1);

        await registerPage.register(firstName, lastName, username, password);
        const dialogMessage = await dialogPromise;
        expect(dialogMessage).toBe('User Registered Successfully.');
        saveUser({ firstName, lastName, username, password });
    })
})