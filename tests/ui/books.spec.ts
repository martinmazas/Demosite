import { test, expect } from '@/fixtures';

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
});
