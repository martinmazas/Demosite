import { test, expect } from '@/fixtures';
import { registerUser, deleteUser, generateToken } from '@/functions/auth';
import { listBooks } from '@/functions/books';
import { createCredentials } from '@/functions/utils';
import { BOOK } from '@/pages/BookPage';

test.describe('Books', () => {
    test(
        'Catalog > Book list displayed in table',
        { annotation: { type: 'id', description: 'TC-BU001' } },
        async ({ booksPage }) => {
            const { books } = await listBooks(booksPage);
            expect(books.length).toBeGreaterThan(0);
        }
    );

    test(
        'Catalog > Search for a book',
        { annotation: { type: 'id', description: 'TC-BU002' } },
        async ({ booksPage }) => {
            const { books } = await booksPage.searchBooks(BOOK.name);
            expect(books.length).toBeGreaterThan(0);
            expect(books[0].title).toBe(BOOK.name);
        }
    );

    test(
        'Choose a book > Detail view',
        { annotation: { type: 'id', description: 'TC-BU003' } },
        async ({ booksPage }) => {
            await booksPage.goto('/books');
            await booksPage.getByRole('link', { name: BOOK.name }).click();
            expect(booksPage.url()).toContain(BOOK.isbn);
        }
    )

    test(
        'Collection > Add book and verify in profile',
        { annotation: { type: 'id', description: 'COLL-001' } },
        async ({ api, booksPage, loginPage }) => {
            const { credentials } = createCredentials();

            await registerUser(api, credentials);
            await loginPage.login(credentials.userName, credentials.password);

            try {
                await booksPage.addBookToCollection(BOOK.name);
                await booksPage.verifyBookAddedSuccessfully();
            } finally {
                const userId = await booksPage.getUserId();
                const { token } = await generateToken(api, credentials);
                await deleteUser(api, token, userId);
            }
        }
    )
});