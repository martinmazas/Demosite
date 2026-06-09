import { BasePage } from '@/fixtures/BasePage';
import { expect } from '@/fixtures/index';

export class LoginPage extends BasePage {
    async login(username: string, password: string): Promise<void> {
        await this.page.goto('/login');
        await this.getByRole('textbox', { name: 'UserName' }).fill(username);
        await this.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.getByRole('button', { name: 'Login' }).click();
    }

    async expectError(): Promise<void> {
        await expect(this.page.getByText('Invalid username or password!')).toBeVisible();
    }

    async handleMessage(msg: string): Promise<void> {
        this.page.on('dialog', async dialog => {
            expect(dialog.message()).toBe(msg);
            await dialog.accept();
        });
    }

    async addBookToCollection(bookName: string): Promise<void> {
        await this.page.getByRole('button', { name: 'Go To Book Store', exact: true }).click();
        await this.page.getByRole('link', { name: bookName }).click();
        await this.page.getByRole('button', { name: 'Add To Your Collection' }).click();
    }
}