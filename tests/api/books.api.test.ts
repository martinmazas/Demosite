import { test, expect } from '@/fixtures/index';
import { generateUserData } from '@/functions/testData';

test.describe('Books', () => {
    test(
        'Catalog > All books returned with required fields',
        { annotation: { type: 'id', description: 'TC-B001' } },
        async ({ api }) => {
            const { books } = await api.listBooks();
            expect(books).toBeDefined();
            expect(books.length).toBeGreaterThan(0);
            const [book] = books;
            expect(book.isbn).toBeTruthy();
            expect(book.title).toBeTruthy();
            expect(book.author).toBeTruthy();
            expect(book.publisher).toBeTruthy();
            expect(book.pages).toBeGreaterThan(0);
            expect(book.publish_date).toBeTruthy();
            expect(book.description).toBeTruthy();
            expect(book.website).toBeTruthy();
        }
    );

    test(
        'Catalog > Single book retrieved by ISBN',
        { annotation: { type: 'id', description: 'TC-B002' } },
        async ({ api }) => {
            const isbn = '9781449325862';
            const book = await api.getBook(isbn);
            expect(book).toBeDefined();
            expect(book.isbn).toBe(isbn);
        }
    );

    test(
        'Collection > Book added to user collection',
        { annotation: { type: 'id', description: 'TC-B003' } },
        async ({ api }) => {
            const isbn = '9781449331818';
            const { username, password } = generateUserData();
            const { userID } = await api.registerUser({ userName: username, password });
            const { token } = await api.generateToken({ userName: username, password });

            try {
                const response = await api.addToCollection(userID, isbn, token);
                expect(response.books).toBeDefined();
                expect(response.books.some(b => b.isbn === isbn)).toBe(true);
            } finally {
                await api.deleteUser({ userID }, token);
            }
        }
    );

    test(
        'Collection > Book removed from user collection',
        { annotation: { type: 'id', description: 'TC-B004' } },
        async ({ api }) => {
            const isbn = '9781449331818';
            const { username, password } = generateUserData();
            const { userID } = await api.registerUser({ userName: username, password });
            const { token } = await api.generateToken({ userName: username, password });

            try {
                await api.addToCollection(userID, isbn, token);
                await api.removeFromCollection(userID, isbn, token);
                const profile = await api.getUserProfile({ userID }, token);
                expect(profile.books.some(b => b.isbn === isbn)).toBe(false);
            } finally {
                await api.deleteUser({ userID }, token);
            }
        }
    );

    test(
        'Collection > All books cleared from user collection',
        { annotation: { type: 'id', description: 'TC-B005' } },
        async ({ api }) => {
            const isbn = '9781449331818';
            const { username, password } = generateUserData();
            const { userID } = await api.registerUser({ userName: username, password });
            const { token } = await api.generateToken({ userName: username, password });

            try {
                await api.addToCollection(userID, isbn, token);
                await api.clearCollection(userID, token);
                const profile = await api.getUserProfile({ userID }, token);
                expect(profile.books).toHaveLength(0);
            } finally {
                await api.deleteUser({ userID }, token);
            }
        }
    );
});
