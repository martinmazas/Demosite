import { test, expect } from '@/fixtures/index';
import { registerUser, generateToken, getUserProfile, deleteUser } from '@/functions/auth';
import { ApiResponse, Credentials, RegisterResponse, UserProfileResponse } from '@/functions/types';
import { createCredentials } from '@/functions/utils';

test.describe('Auth', () => {
    test(
        'Registration > New user created successfully',
        { annotation: { type: 'id', description: 'TC-A001' } },
        async ({ api }) => {
            const { credentials } = createCredentials();
            const response = await registerUser(api, credentials) as RegisterResponse;

            try {
                expect(response.userID).toBeTruthy();
                expect(response.username).toBe(credentials.userName);
                expect(response.books).toHaveLength(0);
            } finally {
                const { token } = await generateToken(api, credentials);
                await deleteUser(api, token, response.userID);
            }
        }
    );

    test(
        'Registration > Registered user > Error returned',
        { annotation: { type: 'id', description: 'TC-A002' } },
        async ({ api }) => {
            const username: string = process.env.TEST_USERNAME!;
            const password: string = process.env.TEST_PASSWORD!;
            const credentials: Credentials = { userName: username, password };

            const response = await registerUser(api, credentials) as ApiResponse;
            expect(response.code).toBe('1204');
            expect(response.message).toBe('User exists!');
        }
    )

    test(
        'Token > Generated successfully for valid credentials',
        { annotation: { type: 'id', description: 'TC-A003' } },
        async ({ api }) => {
            const { credentials } = createCredentials();
            const { userID } = await registerUser(api, credentials) as RegisterResponse;
            const response = await generateToken(api, credentials);

            try {
                expect(response.status).toBe('Success');
                expect(response.result).toBe('User authorized successfully.');
                expect(response.token).toBeTruthy();
                expect(response.expires).toBeTruthy();
            } finally {
                const { token } = await generateToken(api, credentials);
                await deleteUser(api, token, userID);
            }
        }
    );

    test(
        'Token > Not generated due to invalid credentials',
        { annotation: { type: 'id', description: 'TC-A006' } },
        async ({ api }) => {
            const response = await generateToken(api, { userName: 'wrong_username', password: 'wrong_pass' });
            expect(response.status).toBe('Failed');
            expect(response.result).toBe('User authorization failed.');
            expect(response.token).toBeNull();
        }
    )

    test(
        'Profile > Returns correct user data',
        { annotation: { type: 'id', description: 'TC-A004' } },
        async ({ api }) => {
            const { credentials } = createCredentials();
            const { userID } = await registerUser(api, credentials) as RegisterResponse;

            try {
                const { token } = await generateToken(api, credentials);
                const profile = await getUserProfile(api, userID, token) as UserProfileResponse;
                expect(profile.userId).toBe(userID);
                expect(profile.username).toBe(credentials.userName);
            } finally {
                const { token } = await generateToken(api, credentials);
                await deleteUser(api, token, userID);
            }
        }
    );

    test(
        'Account deletion > User deleted and no longer accessible',
        { annotation: { type: 'id', description: 'TC-A005' } },
        async ({ api }) => {
            const { credentials } = createCredentials();
            const { userID } = await registerUser(api, credentials) as RegisterResponse;
            const { token } = await generateToken(api, credentials);
            await deleteUser(api, token, userID);

            const result = await getUserProfile(api, userID, token) as ApiResponse;
            expect(result.message).toBe('User not found!');
        }
    );
});
