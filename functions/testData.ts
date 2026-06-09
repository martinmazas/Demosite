import { faker } from '@faker-js/faker';
import type { UserData } from './types';

export function uniqueUsername(): string {
    return faker.internet.username();
}

export function uniquePassword(): string {
    const password: string = faker.internet.password({ length: 4, memorable: false, pattern: /[a-z]/ })
        + faker.string.fromCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1)
        + faker.string.fromCharacters('0123456789', 1)
        + faker.string.fromCharacters('!@#$%^&*', 1)
        + faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 1);

    return password;
}


export function generateUserData(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = uniqueUsername();
    const password = uniquePassword();

    return { firstName, lastName, username, password };
}
