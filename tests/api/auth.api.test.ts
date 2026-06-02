import { test, expect } from '@/fixtures/index';
import type { Credentials } from '@/functions/auth';
import { generateUserData } from '@/functions/testData';
import { saveUser, getLastUser, removeUser } from '@/functions/userStorage';

test.describe('Auth api', () => {
    test('Register new user > New user successfully created', async ({ api }) => {
        // Generate user data, register the user via API and check the response is accurate
        const { firstName, lastName, username, password } = generateUserData();
        const userData: Credentials = {
            userName: username,
            password
        }
        const response = await api.registerUser(userData);
        expect(response.userID).toBeTruthy();
        expect(response.username).toBe(username);
        expect(response.books).toHaveLength(0);
        saveUser({ firstName, lastName, username, password, userID: response.userID });
    })

    test('Generate token > New token was successfully generated', async ({ api }) => {
        // Generate a new token for a specific user
        const credentials: Credentials = {
            userName: process.env.TEST_USERNAME!,
            password: process.env.TEST_PASSWORD!,
        };

        const response = await api.generateToken(credentials);

        expect(response.status).toBe('Success');
        expect(response.result).toBe('User authorized successfully.');
        expect(response.token).toBeTruthy();
        expect(response.expires).toBeTruthy();
    });

    test('User profile > Get user profile', async ({ api }) => {
        const userId: string = process.env.TEST_USERID!;
        const credentials: Credentials = {
            userName: process.env.TEST_USERNAME!,
            password: process.env.TEST_PASSWORD!
        }

        const { token } = await api.generateToken(credentials);
        const profile = await api.getUserProfile({ userID: userId }, token);
        expect(profile.userId).toBe(userId);
        expect(profile.username).toBe(credentials.userName);
    })

    test('Delete user > User was successfully deleted', async ({ api }) => {
        const user = getLastUser();
        const { token } = await api.generateToken({ userName: user.username, password: user.password });
        await api.deleteUser({ userID: user.userID! }, token);
        const { token: newToken } = await api.generateToken({ userName: user.username, password: user.password });
        await expect(api.getUserProfile({ userID: user.userID! }, newToken)).rejects.toThrow('User not found!');
        removeUser(user.userID!);
    })
});
