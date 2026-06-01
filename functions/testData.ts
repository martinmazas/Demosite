import { faker } from '@faker-js/faker';

interface UserData {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export function generateUserData(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName });
    const password = faker.internet.password({ length: 4, memorable: false, pattern: /[a-z]/ })
        + faker.string.fromCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1)
        + faker.string.fromCharacters('0123456789', 1)
        + faker.string.fromCharacters('!@#$%^&*', 1)
        + faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 1);

    return { firstName, lastName, username, password };
}
