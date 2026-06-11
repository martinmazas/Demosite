import { expect, test } from '@/fixtures';
import { deleteUser, generateToken, registerUser } from '@/functions/auth';
import { createCredentials } from '@/functions/utils';
import { BOOK } from '@/pages/BookPage';

test.describe('E2E flow', () => {
    test('Register > Add book > Verify > Remove > Verify gone',
        { annotation: { type: 'id', description: 'E2E-001' } },
        async ({ api, loginPage, booksPage }) => {
            // User registration
            const { credentials } = createCredentials();
            await registerUser(api, credentials);

            try {
                // Login
                await loginPage.login(credentials.userName, credentials.password);
                await loginPage.verifySuccessfulLogin(credentials.userName);

                // Add a Book and verify
                await booksPage.addBookToCollection(BOOK.name);
                await booksPage.verifyBookAddedSuccessfully();

                // Remove Book and verify
                await booksPage.deleteBook(BOOK.isbn);
            } finally {
                const { token } = await generateToken(api, credentials);
                const userId = await booksPage.getUserId();
                await deleteUser(api, token, userId);
            }
        }
    )
}
)