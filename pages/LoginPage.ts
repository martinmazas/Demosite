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
}