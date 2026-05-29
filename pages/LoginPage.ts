import { BasePage } from '../fixtures/BasePage';

export class LoginPage extends BasePage {
    async login(username: string, password: string) {
        await this.navigateTo('/login');
        await this.getByRole('textbox', { name: 'UserName' }).fill(username);
        await this.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.getByRole('button', { name: 'Login' }).click();
    }
}