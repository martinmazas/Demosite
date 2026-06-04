import { test, expect } from '@/fixtures';
import { registerUser } from '@/functions/auth';
import { Book } from '@/functions/books';
import { generateUserData } from '@/functions/testData';

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

    // test(
    //     'Collection > Add book and verify in profile',
    //     { annotation: { type: 'ID', description: 'COLL-001' } },
    //     async ({ booksPage }) => {
    //         const user = generateUserData();
    //         const credentials = {
    //             firstName: user.firstName,
    //             lastName: user.lastName,
    //             userName: user.username,
    //             password: user.password
    //         }
    //         await registerUser(booksPage, credentials);
    //         const api = await booksPage.getAPI();
    //         const userId = await booksPage.getUserId();
    //         const books = await listBooks(api);
    //         // const target: Book = books[0];

    //     }
    // )
});
