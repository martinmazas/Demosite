import { BasePage } from '../fixtures/BasePage';
import { expect } from '@/fixtures/index';

export class LoginPage extends BasePage {
    async login(username: string, password: string) {
        await this.navigateTo('/login');
        await this.findByRole('textbox', 'UserName').fill(username);
        await this.findByRole('textbox', 'Password').fill(password);
        await this.findByRole('button', 'Login').click();
    }

    async expectError(): Promise<void> {
        await expect(this.page.getByText('Invalid username or password!')).toBeVisible();
    }
}