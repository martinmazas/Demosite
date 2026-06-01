import { test, expect } from '@/fixtures/index';

test.describe('Books api', () => {
    test('Get list of books', async ({ api }) => {
        const { books } = await api.getBooks();
        expect(books).toBeDefined();
        expect(books.length).toBeGreaterThan(0);
        const book = books[0];
        expect(book.isbn).toBeTruthy();
        expect(book.title).toBeTruthy();
        expect(book.author).toBeTruthy();
        expect(book.publisher).toBeTruthy();
        expect(book.pages).toBeGreaterThan(0);
        expect(book.publish_date).toBeTruthy();
        expect(book.description).toBeTruthy();
        expect(book.website).toBeTruthy();
    });
})