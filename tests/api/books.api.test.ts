import { test, expect } from '@/fixtures/index';
import { getLastUser } from '@/functions/userStorage';

test.describe('Books api', () => {
    test('Get list of books', async ({ api }) => {
        const { books } = await api.listBooks();
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

    test('Get a book', async ({ api }) => {
        const isbn: string = '9781449325862';
        const book = await api.getBook(isbn);
        expect(book).toBeDefined();
        expect(book.isbn).toBe(isbn);
    })

    test('Add book to user collection > Check book is in user collection', async ({ api }) => {
        const { books } = await api.listBooks();
        const randomBook = books[Math.floor(Math.random() * books.length)];

        const user = getLastUser();
        const { token } = await api.generateToken({ userName: user.username, password: user.password });

        const response = await api.addBooksToCollection(user.userID!, randomBook.isbn, token);
        expect(response.books).toBeDefined();
        expect(response.books.some(b => b.isbn === randomBook.isbn)).toBe(true);
    })

    test('Remove book from collection > Book is removed from user collection', async ({ api }) => {
        const { books } = await api.listBooks();
        const randomBook = books[Math.floor(Math.random() * books.length)];

        const user = getLastUser();
        const { token } = await api.generateToken({ userName: user.username, password: user.password });

        await api.addBooksToCollection(user.userID!, randomBook.isbn, token);
        await api.removeBookFromCollection(user.userID!, randomBook.isbn, token);

        const profile = await api.getUserProfile({ userID: user.userID! }, token);
        expect(profile.books.some(b => b.isbn === randomBook.isbn)).toBe(false);
    })
})