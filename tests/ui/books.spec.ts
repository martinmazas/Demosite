import { test, expect } from '@/fixtures';
import { registerUser, generateToken, getUserProfile, deleteUser } from '@/functions/auth';
import { addToCollection, listBooks } from '@/functions/books';
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
            await booksPage.navigateTo('/books');
            await booksPage.findByRole('link', bookName).click();
            expect(booksPage.url()).toContain(isbn);
        }
    )

    test(
        'Collection > Add book and verify in profile',
        { annotation: { type: 'ID', description: 'COLL-001' } },
        async ({ booksPage, api }) => {
            const user = generateUserData();
            const credentials = { userName: user.username, password: user.password };
            const registerPayload = { firstName: user.firstName, lastName: user.lastName, ...credentials };

            const { userID } = await registerUser(booksPage, registerPayload);
            const { books } = await listBooks(booksPage);
            const isbn = books[0].isbn;

            const { token } = await generateToken(api, credentials);
            await addToCollection(api, userID, isbn, token);

            const profile = await getUserProfile(api, userID, token) as UserProfileResponse;
            expect(profile.books.some(b => b.isbn === isbn)).toBe(true);

            await deleteUser(api, token, userID);
        }
    )
});