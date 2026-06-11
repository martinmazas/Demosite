import { Locator } from '@playwright/test';
import { BasePage } from '../fixtures/BasePage';
import { Book, BooksResponse } from '../functions/types';
import { expect } from '@/fixtures';

export const BOOK = {
    name: 'Speaking JavaScript',
    isbn: '9781449365035',
};

export class BookPage extends BasePage {
    readonly rows: Locator;

    constructor(...args: ConstructorParameters<typeof BasePage>) {
        super(...args);
        this.rows = this.page.locator('table tbody tr');
    }
    /**
     * Scrapes all rows from the visible book table. Column order is fixed:
     * image(0), title(1), author(2), publisher(3). Fields absent from the
     * table (isbn, subTitle, etc.) are left as empty-string/zero defaults.
     */
    async readTableRows(): Promise<Book[]> {
        await this.rows.first().waitFor();
        const count = await this.rows.count();
        const books: Book[] = [];

        for (let i = 0; i < count; i++) {
            const cells = this.rows.nth(i).locator('td');
            const title = await cells.nth(1).innerText();
            const author = await cells.nth(2).innerText();
            const publisher = await cells.nth(3).innerText();

            books.push({
                isbn: '',
                title,
                subTitle: '',
                author,
                publish_date: '',
                publisher,
                pages: 0,
                description: '',
                website: '',
            });
        }

        return books;
    }

    async getBooks(): Promise<BooksResponse> {
        await this.goto('/books');
        return { books: await this.readTableRows() };
    }

    async searchBooks(query: string): Promise<BooksResponse> {
        await this.goto('/books');
        const searchBox = this.getByRole('textbox', { name: 'Type to search' });
        await searchBox.fill(query);
        await searchBox.press('Enter');
        return { books: await this.readTableRows() };
    }

    async addBookToCollection(bookName: string): Promise<void> {
        await this.getByRole('button', { name: 'Go To Book Store', exact: true }).click();
        await this.getByRole('link', { name: bookName }).click();
        await this.getByRole('button', { name: 'Add To Your Collection' }).click();
    }

    async verifyBookAddedSuccessfully(): Promise<void> {
        const dialogPromise = this.captureNextDialog();
        const dialogMessage = await dialogPromise;
        expect(dialogMessage).toBe('Book added to your collection.');

        await this.goto('/profile');
        await expect(this.getByRole('link', { name: BOOK.name })).toBeVisible();
    }

    async deleteBook(isbn: string): Promise<void> {
        await this.goto('/profile');
        const nextDialog = this.captureNextDialog();

        await this.locator(`#delete-record-${isbn}`).click();
        await expect(this.getByText('Delete Book')).toBeVisible();
        await this.getByRole('button', { name: 'OK', exact: true }).click();
        const dialogMessage = await nextDialog;
        expect(dialogMessage).toBe('Book deleted.');
    }
}
