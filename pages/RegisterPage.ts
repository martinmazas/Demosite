import { BasePage } from '@/fixtures/BasePage';
export class RegisterPage extends BasePage {
    async register(firstName: string, lastName: string, username: string, password: string) {
        await this.page.goto('/register');
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'UserName' }).fill(username);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.page.getByRole('button', { name: "Register" }).click();
    }
}