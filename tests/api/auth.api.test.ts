import { test, expect } from '@/fixtures/index';
import { registerUser, generateToken, getUserProfile, deleteUser } from '@/functions/auth';
import { generateUserData } from '@/functions/testData';
import { ApiResponse, RegisterResponse, UserProfileResponse } from '@/functions/types';

test.describe('Auth', () => {
    test(
        'Registration > New user created successfully',
        { annotation: { type: 'id', description: 'TC-A001' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const response = await registerUser(api, { userName: username, password }) as RegisterResponse;

            try {
                expect(response.userID).toBeTruthy();
                expect(response.username).toBe(username);
                expect(response.books).toHaveLength(0);
            } finally {
                const { token } = await generateToken(api, { userName: username, password });
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

            const response = await registerUser(api, { userName: username, password }) as ApiResponse;
            expect(response.code).toBe('1204');
            expect(response.message).toBe('User exists!');
        }
    )

    test(
        'Token > Generated successfully for valid credentials',
        { annotation: { type: 'id', description: 'TC-A003' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password }) as RegisterResponse;
            const response = await generateToken(api, { userName: username, password });

            try {
                expect(response.status).toBe('Success');
                expect(response.result).toBe('User authorized successfully.');
                expect(response.token).toBeTruthy();
                expect(response.expires).toBeTruthy();
            } finally {
                const { token } = await generateToken(api, { userName: username, password });
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
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password }) as RegisterResponse;

            try {
                const { token } = await generateToken(api, { userName: username, password });
                const profile = await getUserProfile(api, userID, token) as UserProfileResponse;
                expect(profile.userId).toBe(userID);
                expect(profile.username).toBe(username);
            } finally {
                const { token } = await generateToken(api, { userName: username, password });
                await deleteUser(api, token, userID);
            }
        }
    );

    test(
        'Account deletion > User deleted and no longer accessible',
        { annotation: { type: 'id', description: 'TC-A005' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password }) as RegisterResponse;
            const { token } = await generateToken(api, { userName: username, password });
            await deleteUser(api, token, userID);

            const result = await getUserProfile(api, userID, token) as ApiResponse;
            expect(result.message).toBe('User not found!');
        }
    );
});
