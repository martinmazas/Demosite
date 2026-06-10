import { expect, test } from '@/fixtures';
import { deleteUser, generateToken, registerUser } from '@/functions/auth';
import { RegisterResponse } from '@/functions/types';
import { createCredentials } from '@/functions/utils';

test.describe('Login', () => {
    test(
        'Valid credentials > Profile page is shown',
        { annotation: { type: 'id', description: 'TC-L001' } },
        async ({ loginPage, api }) => {
            const { credentials } = createCredentials();
            const registration = await registerUser(api, credentials) as RegisterResponse;

            try {
                await loginPage.login(credentials.userName, credentials.password);
                await expect(loginPage.getByRole('button', { name: 'Logout' })).toBeVisible();
                expect(loginPage.url()).toContain("profile");
            } finally {
                const { token } = await generateToken(api, credentials);
                await deleteUser(api, token, registration.userID);
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
