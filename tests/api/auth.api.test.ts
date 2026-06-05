import { test, expect } from '@/fixtures/index';
import { registerUser, generateToken, getUserProfile, deleteUser } from '@/functions/auth';
import { generateUserData } from '@/functions/testData';
import { DeleteResponse, UserProfileResponse } from '@/functions/types';

test.describe('Auth', () => {
    test(
        'Registration > New user created successfully',
        { annotation: { type: 'id', description: 'TC-A001' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const response = await registerUser(api, { userName: username, password });
            const { token } = await generateToken(api, { userName: username, password });

            try {
                expect(response.userID).toBeTruthy();
                expect(response.username).toBe(username);
                expect(response.books).toHaveLength(0);
            } finally {
                await deleteUser(api, token, response.userID);
            }
        }
    );

    test(
        'Token > Generated successfully for valid credentials',
        { annotation: { type: 'id', description: 'TC-A002' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password });
            const response = await generateToken(api, { userName: username, password });

            try {
                expect(response.status).toBe('Success');
                expect(response.result).toBe('User authorized successfully.');
                expect(response.token).toBeTruthy();
                expect(response.expires).toBeTruthy();
            } finally {
                await deleteUser(api, response.token, userID);
            }
        }
    );

    test(
        'Profile > Returns correct user data',
        { annotation: { type: 'id', description: 'TC-A003' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password });
            const { token } = await generateToken(api, { userName: username, password });

            try {
                const profile = await getUserProfile(api, userID, token) as UserProfileResponse;
                expect(profile.userId).toBe(userID);
                expect(profile.username).toBe(username);
            } finally {
                await deleteUser(api, token, userID);
            }
        }
    );

    test(
        'Account deletion > User deleted and no longer accessible',
        { annotation: { type: 'id', description: 'TC-A004' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password });
            const { token } = await generateToken(api, { userName: username, password });

            await deleteUser(api, token, userID);

            const result = await getUserProfile(api, userID, token);
            expect('userId' in result).toBe(false);
            expect((result as DeleteResponse).message).toBe('User not found!');
        }
    );
});
