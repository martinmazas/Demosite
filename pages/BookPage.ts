import { BasePage } from '../fixtures/BasePage';
import { Book, BooksResponse } from '../functions/types';

export class BookPage extends BasePage {
    async getBooks(): Promise<BooksResponse> {
        await this.navigateTo('/books');
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

        return { books };
    }
}