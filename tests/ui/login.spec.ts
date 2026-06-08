import { expect, test } from '@/fixtures';
import { registerUser } from '@/functions/auth';
import { generateUserData } from '@/functions/testData';
import { RegisterResponse } from '@/functions/types';

test.describe('Login', () => {
    test(
        'Valid credentials > Profile page is shown',
        { annotation: { type: 'id', description: 'TC-L001' } },
        async ({ loginPage, api }) => {
            const { username, password } = generateUserData();
            const registration = await registerUser(api, { userName: username, password }) as RegisterResponse;

            try {
                await loginPage.login(username, password);
                await expect(loginPage.getByRole('button', { name: 'Logout' })).toBeVisible();
                expect(loginPage.url()).toContain("profile");

            } finally {
                const tokenRes = await api.post('/Account/v1/GenerateToken', {
                    data: { userName: username, password },
                });
                const { token } = await tokenRes.json();
                await api.delete(`/Account/v1/User/${registration.userID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        }
    );

    test(
        'Invalid credentials > Error message is shown',
        { annotation: { type: 'id', description: 'TC-L002' } },
        async ({ loginPage }) => {
            await loginPage.login('wrong_username', 'wrong_password');
            await expect(loginPage.page.getByText('Invalid username or password!')).toBeVisible();
        }
    );
});
