import { expect, test } from '@/fixtures';
import { generateToken, deleteUser, getUserProfile } from '@/functions/auth';
import { generateUserData } from '@/functions/testData';

test.describe('Registration', () => {
    test.skip(
        'Registration > New user created successfully',
        { annotation: { type: 'id', description: 'TC-L003' } },
        async ({ registerPage, api }) => {
            const { firstName, lastName, username, password } = generateUserData();

            await registerPage.register(firstName, lastName, username, password);
            const dialogMessage = await registerPage.captureNextDialog();
            expect(dialogMessage).toBe('User Registered Successfully.');
            const { token } = await generateToken(api, { userName: username, password });
            const userId = await registerPage.getUserId();
            console.log('userId', userId);

            try {
                const user = await getUserProfile(api, userId, token);
                console.log('user', user);
                // await loginPage.login(username, password);
                // await expect(loginPage.getByRole('button', { name: 'Logout' })).toBeVisible();
            } finally {
                // const userID = await loginPage.getUserId();
                await deleteUser(api, token, userId);
            }
        }
    );
})