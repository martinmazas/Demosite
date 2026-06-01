import { test, expect } from '@/fixtures/index';
import type { Credentials } from '@/functions/auth';
import { generateUserData } from '@/functions/testData';
import { saveUser, getRandomUser } from '@/functions/userStorage';

test.describe('Auth api', () => {
    test('Register new user > New user successfully created', async ({ api }) => {
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
        const user = getRandomUser();
        const { token } = await api.generateToken({ userName: user.username, password: user.password });
        const profile = await api.getUserProfile({ userID: user.userID! }, token);
        expect(profile.userId).toBe(user.userID);
        expect(profile.username).toBe(user.username);
    })
});
