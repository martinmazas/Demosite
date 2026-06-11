import { BasePage } from '@/fixtures/BasePage';
import { expect } from '@/fixtures/index';

export class LoginPage extends BasePage {
    async login(username: string, password: string): Promise<void> {
        await this.goto('/login');
        await this.getByRole('textbox', { name: 'UserName' }).fill(username);
        await this.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.getByRole('button', { name: 'Login' }).click();
    }

    async expectError(): Promise<void> {
        await expect(this.getByText('Invalid username or password!')).toBeVisible();
    }

    async verifySuccessfulLogin(username: string): Promise<void> {
        await expect(this.getByText('User Name :')).toBeVisible();
        await expect(this.getByText(username)).toBeVisible();
        await expect(this.getByRole('button', { name: 'Logout' })).toBeVisible();
        expect(this.url()).toContain("profile");
    }
}