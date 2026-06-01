import { test, expect } from '@/fixtures/index';
import type { Credentials } from '@/functions/auth';

test.describe('Auth api', () => {
    test('Generate token > New token was successfully generated', async ({ api }) => {
        const credentials: Credentials = {
            username: process.env.TEST_USERNAME!,
            password: process.env.TEST_PASSWORD!,
        };

        const response = await api.generateToken(credentials);

        expect(response.status).toBe('Success');
        expect(response.result).toBe('User authorized successfully.');
        expect(response.token).toBeTruthy();
        expect(response.expires).toBeTruthy();
    });
});
