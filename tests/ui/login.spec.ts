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
});
