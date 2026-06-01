import { BasePage } from '@/fixtures/BasePage';

export class RegisterPage extends BasePage {
    async register(firstName: string, lastName: string, username: string, password: string) {
        await this.navigateTo('/register');
        await this.findByRole('textbox', 'First Name').fill(firstName);
        await this.findByRole('textbox', 'Last Name').fill(lastName);
        await this.findByRole('textbox', 'UserName').fill(username);
        await this.findByRole('textbox', 'Password').fill(password);
        await this.findByRole('button', "Register").click();
    }
}