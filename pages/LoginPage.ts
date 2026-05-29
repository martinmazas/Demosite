import { BasePage } from '../fixtures/BasePage';

export class LoginPage extends BasePage {
    async login(username: string, password: string) {
        await this.navigateTo('/login');
        await this.findByRole('textbox', 'UserName').fill(username);
        await this.findByRole('textbox', 'Password').fill(password);
        await this.findByRole('button', 'Login').click();
    }
}