import { BasePage } from '../fixtures/BasePage';
import { Book, BooksResponse } from '../functions/types';

export const BOOK = {
    name: 'Speaking JavaScript',
    isbn: '9781449365035',
};

export class BookPage extends BasePage {
    /**
     * Scrapes all rows from the visible book table. Column order is fixed:
     * image(0), title(1), author(2), publisher(3). Fields absent from the
     * table (isbn, subTitle, etc.) are left as empty-string/zero defaults.
     */
    private async readTableRows(): Promise<Book[]> {
        const rows = this.page.locator('table tbody tr');
        await rows.first().waitFor();

        const count = await rows.count();
        const books: Book[] = [];

        for (let i = 0; i < count; i++) {
            const cells = rows.nth(i).locator('td');
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
        const searchBox = this.getByRole('textbox', {name: 'Type to search'});
        await searchBox.fill(query);
        await searchBox.press('Enter');
        return { books: await this.readTableRows() };
    }
}
