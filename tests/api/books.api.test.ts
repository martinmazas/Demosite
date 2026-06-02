import { test, expect } from '@/fixtures/index';
import { Credentials } from '@/functions/types';

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
        const isbn: string = "9781449331818";
        const user: Credentials = {
            userName: process.env.TEST_USERNAME!,
            password: process.env.TEST_PASSWORD!,
        }
        const userId: string = process.env.TEST_USERID!;
        const { token } = await api.generateToken({ userName: user.userName, password: user.password });

        const response = await api.addToCollection(userId, isbn, token);
        expect(response.books).toBeDefined();
        expect(response.books.some(b => b.isbn === isbn)).toBe(true);
    })

    test('Remove book from collection > Book is removed from user collection', async ({ api }) => {
        const isbn: string = "9781449331818";
        const user: Credentials = {
            userName: process.env.TEST_USERNAME!,
            password: process.env.TEST_PASSWORD!,
        }
        const userId: string = process.env.TEST_USERID!;
        const { token } = await api.generateToken({ userName: user.userName, password: user.password });

        // Ensure the book is in the collection before removing it
        try { await api.addToCollection(userId, isbn, token); } catch { /* already in collection */ }

        await api.removeFromCollection(userId, isbn, token);

        const profile = await api.getUserProfile({ userID: userId }, token);
        expect(profile.books.some(b => b.isbn === isbn)).toBe(false);
    })

    test('Clear collection from user', async ({ api }) => {
        const userId: string = process.env.TEST_USERID!;
        const user: Credentials = {
            userName: process.env.TEST_USERNAME!,
            password: process.env.TEST_PASSWORD!,
        }

        const { token } = await api.generateToken({ userName: user.userName, password: user.password });
        const response = await api.clearCollection(userId, token);
        console.log(response);

        expect(response.message).not.toBe("User Id not correct!");
    })
})