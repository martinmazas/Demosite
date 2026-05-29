import { BasePage } from '@/fixtures/BasePage';

export class RegisterPage extends BasePage {
    async register(firstName: string, lastName: string, username: string, password: string) {
        await this.navigateTo('/register');
        await this.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await this.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        await this.getByRole('textbox', { name: 'UserName' }).fill(username);
        await this.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.getByRole('button', { name: "Register" }).click();
    }
}