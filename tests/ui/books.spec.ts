import { test, expect } from '@/fixtures';
import { registerUser, deleteUser, generateToken } from '@/functions/auth';
import { listBooks } from '@/functions/books';
import { generateUserData } from '@/functions/testData';

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
            const bookName = 'Speaking JavaScript';
            const { books } = await booksPage.searchBooks(bookName);
            expect(books.length).toBeGreaterThan(0);
            expect(books[0].title).toBe(bookName);
        }
    )

    test(
        'Choose a book > Detail view',
        { annotation: { type: 'id', description: 'TC-BU003' } },
        async ({ booksPage }) => {
            const isbn = '9781449365035';
            const bookName = 'Speaking JavaScript';
            await booksPage.goto('/books');
            await booksPage.getByRole('link', { name: bookName }).click();
            expect(booksPage.url()).toContain(isbn);
        }
    )

    test(
        'Collection > Add book and verify in profile',
        { annotation: { type: 'ID', description: 'COLL-001' } },
        async ({ loginPage, api }) => {
            const user = generateUserData();
            const credentials = {
                userName: user.username,
                password: user.password
            }

            const bookName = 'Git Pocket Guide';
            await registerUser(api, credentials);

            await loginPage.login(credentials.userName, credentials.password);

            try {
                await loginPage.addBookToCollection(bookName);

                await loginPage.handleMessage('Book added to your collection.');
                expect(loginPage.url()).toContain('books');


                await loginPage.goto('/profile');
                await expect(loginPage.getByRole('link', { name: bookName })).toBeVisible();
            } finally {
                const userId = await loginPage.getUserId();
                const { token } = await generateToken(api, credentials);
                await deleteUser(api, token, userId);
            }
        }
    )
});