import { expect, test } from '@/fixtures';
import { generateUserData } from '@/functions/testData';

test.describe('Login', () => {
    test(
        'Valid credentials > Profile page is shown',
        { annotation: { type: 'id', description: 'TC-L001' } },
        async ({ loginPage, api }) => {
            const { username, password } = generateUserData();
            const { userID } = await api.registerUser({ userName: username, password });

            try {
                await loginPage.login(username, password);
                await expect(loginPage.findByRole('button', 'Logout')).toBeVisible();
                expect(loginPage.url()).toContain('profile');
            } finally {
                const { token } = await api.generateToken({ userName: username, password });
                await api.deleteUser({ userID }, token);
            }
        }
    );

    test(
        'Invalid credentials > Error message is shown',
        { annotation: { type: 'id', description: 'TC-L002' } },
        async ({ loginPage }) => {
            await loginPage.login('wrong_username', 'wrong_password');
            await loginPage.expectError();
        }
    );

    test.skip(
        'Registration > New user created successfully',
        { annotation: { type: 'id', description: 'TC-L003' } },
        async ({ registerPage, loginPage, api }) => {
            const { firstName, lastName, username, password } = generateUserData();

            const dialogPromise = new Promise<string>(resolve => {
                registerPage.on('dialog', async dialog => {
                    const message = dialog.message();
                    await dialog.accept();
                    resolve(message);
                });
            });

            await registerPage.register(firstName, lastName, username, password);
            const dialogMessage = await dialogPromise;

            await loginPage.login(username, password);
            const userID = await loginPage.getUserId();
            const { token } = await api.generateToken({ userName: username, password });

            try {
                expect(dialogMessage).toBe('User Registered Successfully.');
                await expect(loginPage.findByRole('button', 'Logout')).toBeVisible();
            } finally {
                await api.deleteUser({ userID }, token);
            }
        }
    );
});
