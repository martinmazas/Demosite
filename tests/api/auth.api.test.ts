import { test, expect } from '@/fixtures/index';
import { generateUserData } from '@/functions/testData';

test.describe('Auth', () => {
    test(
        'Registration > New user created successfully',
        { annotation: { type: 'id', description: 'TC-A001' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const response = await api.registerUser({ userName: username, password });
            const { token } = await api.generateToken({ userName: username, password });

            try {
                expect(response.userID).toBeTruthy();
                expect(response.username).toBe(username);
                expect(response.books).toHaveLength(0);
            } finally {
                await api.deleteUser({ userID: response.userID }, token);
            }
        }
    );

    test(
        'Token > Generated successfully for valid credentials',
        { annotation: { type: 'id', description: 'TC-A002' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await api.registerUser({ userName: username, password });
            const response = await api.generateToken({ userName: username, password });

            try {
                expect(response.status).toBe('Success');
                expect(response.result).toBe('User authorized successfully.');
                expect(response.token).toBeTruthy();
                expect(response.expires).toBeTruthy();
            } finally {
                await api.deleteUser({ userID }, response.token);
            }
        }
    );

    test(
        'Profile > Returns correct user data',
        { annotation: { type: 'id', description: 'TC-A003' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await api.registerUser({ userName: username, password });
            const { token } = await api.generateToken({ userName: username, password });

            try {
                const profile = await api.getUserProfile({ userID }, token);
                expect(profile.userId).toBe(userID);
                expect(profile.username).toBe(username);
            } finally {
                await api.deleteUser({ userID }, token);
            }
        }
    );

    test(
        'Account deletion > User deleted and no longer accessible',
        { annotation: { type: 'id', description: 'TC-A004' } },
        async ({ api }) => {
            const { username, password } = generateUserData();
            const { userID } = await api.registerUser({ userName: username, password });
            const { token } = await api.generateToken({ userName: username, password });

            await api.deleteUser({ userID }, token);

            const { token: freshToken } = await api.generateToken({ userName: username, password });
            await expect(api.getUserProfile({ userID }, freshToken)).rejects.toThrow('User not found!');
        }
    );
});
