import { faker } from '@faker-js/faker';
import type { UserData, Username, Password } from './types';

export function uniqueUsername(): Username {
    const username: string = faker.internet.username();
    return { username };
}

export function uniquePassword(): Password {
    const password = faker.internet.password({ length: 4, memorable: false, pattern: /[a-z]/ })
        + faker.string.fromCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1)
        + faker.string.fromCharacters('0123456789', 1)
        + faker.string.fromCharacters('!@#$%^&*', 1)
        + faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 1);

    return { password };
}


export function generateUserData(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const { username } = uniqueUsername();
    const { password } = uniquePassword();

    return { firstName, lastName, username, password };
}
