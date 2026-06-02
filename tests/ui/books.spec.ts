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
});
