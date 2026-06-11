import { expect, test } from '@/fixtures';
import { generateToken, getUserProfile } from '@/functions/auth';
import { Credentials, UserProfileResponse } from '@/functions/types';

test.describe('Profile', () => {
    test(
        'Correct data displayed after login',
        { annotation: { type: 'id', description: 'PF-001' } },
        async ({ loginPage, api, booksPage }) => {
            const username: string = process.env.TEST_USERNAME!;
            const password: string = process.env.TEST_PASSWORD!;
            const credentials: Credentials = { userName: username, password };

            await loginPage.login(credentials.userName, credentials.password);
            await loginPage.verifySuccessfulLogin(username);

            const userId = await loginPage.getUserId();
            const { token } = await generateToken(api, credentials);
            const user = await getUserProfile(api, userId, token) as UserProfileResponse;
            const profileBooks = await booksPage.readTableRows();

            expect(user.books).toHaveLength(profileBooks.length);
            const userBookTitles = user.books.map(b => b.title);
            for (const book of profileBooks) {
                expect(userBookTitles).toContain(book.title);
            }
        }
    )
})