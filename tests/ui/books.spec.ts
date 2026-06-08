import { test, expect } from '@/fixtures';
import { registerUser, generateToken, getUserProfile, deleteUser } from '@/functions/auth';
import { addToCollection, clearCollection, listBooks } from '@/functions/books';
import { generateUserData } from '@/functions/testData';
import { UserProfileResponse } from '@/functions/types';

test.describe('Books', () => {
    test(
        'Catalog > Book list displayed in table',
        { annotation: { type: 'id', description: 'TC-BU001' } },
        async ({ booksPage }) => {
            const { books } = await booksPage.getBooks();
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
        async ({ booksPage, loginPage, api }) => {
            const user = generateUserData();
            const credentials = {
                userName: user.username,
                password: user.password
            }

            const bookName = 'Git Pocket Guide';
            await registerUser(api, credentials);

            await loginPage.login(credentials.userName, credentials.password);
            const userId = await loginPage.getUserId();

            try {
                await loginPage.getByRole('button', { name: 'Go To Book Store', exact: true }).click();
                expect(loginPage.url()).toContain('books');
                await loginPage.getByRole('link', { name: bookName }).click();

                loginPage.once('dialog', dialog => {
                    console.log(`Dialog message: ${dialog.message()}`);
                    dialog.dismiss().catch(() => { });
                });

                await loginPage.getByRole('button', { name: 'Add To Your Collection' }).click();
                await loginPage.goto('/profile');
                await expect(loginPage.getByRole('link', { name: bookName })).toBeVisible();
            } finally {
                const { token } = await generateToken(api, { userName: credentials.userName, password: credentials.password });
                await deleteUser(api, token, userId);
            }
        }
    )
});