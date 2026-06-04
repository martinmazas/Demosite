import { expect, test } from '@/fixtures';
import { generateUserData } from '@/functions/testData';

test.describe('Registration', () => {
    test.skip(
        'Registration > New user created successfully',
        { annotation: { type: 'id', description: 'TC-L003' } },
        async ({ registerPage, loginPage, api }) => {
            const { firstName, lastName, username, password } = generateUserData();

            const dialogPromise = new Promise<string>(resolve => {
                registerPage.once('dialog', async dialog => {
                    const message = dialog.message();
                    await dialog.accept();
                    resolve(message);
                });
            });

            await registerPage.register(firstName, lastName, username, password);
            const dialogMessage = await dialogPromise;
            expect(dialogMessage).toBe('User Registered Successfully.');

            try {
                await loginPage.login(username, password);
                await expect(loginPage.findByRole('button', 'Logout')).toBeVisible();
            } finally {
                const userID = await loginPage.getUserId();
                const { token } = await api.generateToken({ userName: username, password });
                await api.deleteUser({ userID }, token);
            }
        }
    );
})