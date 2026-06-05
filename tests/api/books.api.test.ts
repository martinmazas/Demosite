import { test, expect } from '@/fixtures/index';
import { registerUser, generateToken, getUserProfile, deleteUser } from '@/functions/auth';
import { listBooks, getBook, addToCollection, removeFromCollection, clearCollection } from '@/functions/books';
import { generateUserData } from '@/functions/testData';
import { UserProfileResponse } from '@/functions/types';

test.describe('Books', () => {
    test(
        'Catalog > All books returned with required fields',
        { annotation: { type: 'id', description: 'TC-B001' } },
        async ({ api }) => {
            const { books } = await listBooks(api);
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
            const book = await getBook(api, isbn);
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
            const { userID } = await registerUser(api, { userName: username, password });
            const { token } = await generateToken(api, { userName: username, password });

            try {
                const response = await addToCollection(api, userID, isbn, token);
                expect(response.books).toBeDefined();
                expect(response.books.some(b => b.isbn === isbn)).toBe(true);
            } finally {
                await deleteUser(api, token, userID);
            }
        }
    );

    test(
        'Collection > Book removed from user collection',
        { annotation: { type: 'id', description: 'TC-B004' } },
        async ({ api }) => {
            const isbn = '9781449331818';
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password });
            const { token } = await generateToken(api, { userName: username, password });

            try {
                await addToCollection(api, userID, isbn, token);
                await removeFromCollection(api, userID, isbn, token);
                const profile = await getUserProfile(api, userID, token) as UserProfileResponse;
                expect(profile.books.some(b => b.isbn === isbn)).toBe(false);
            } finally {
                await deleteUser(api, token, userID);
            }
        }
    );

    test(
        'Collection > All books cleared from user collection',
        { annotation: { type: 'id', description: 'TC-B005' } },
        async ({ api }) => {
            const isbn = '9781449331818';
            const { username, password } = generateUserData();
            const { userID } = await registerUser(api, { userName: username, password });
            const { token } = await generateToken(api, { userName: username, password });

            try {
                await addToCollection(api, userID, isbn, token);
                await clearCollection(api, userID, token);
                const profile = await getUserProfile(api, userID, token) as UserProfileResponse;
                expect(profile.books).toHaveLength(0);
            } finally {
                await deleteUser(api, token, userID);
            }
        }
    );
});
