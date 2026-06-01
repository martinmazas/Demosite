import { test, expect } from '@/fixtures/index';
import { getRandomUser } from '@/functions/userStorage';

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

    test('Add book to user collection > Check book is in user collection', async ({ api }) => {
        const { books } = await api.getBooks();
        const randomBook = books[Math.floor(Math.random() * books.length)];

        const user = getRandomUser();
        const { token } = await api.generateToken({ userName: user.username, password: user.password });

        const response = await api.addBooksToCollection(user.userID!, randomBook.isbn, token);
        expect(response.books).toBeDefined();
        expect(response.books.some(b => b.isbn === randomBook.isbn)).toBe(true);
    })
})