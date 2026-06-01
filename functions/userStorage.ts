import * as fs from 'fs';
import * as path from 'path';

interface UserRecord {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    userID?: string;
}

export function getRandomUser(): UserRecord {
    const filePath = path.join(path.resolve('.auth'), 'user.json');
    const users: UserRecord[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const withId = users.filter(u => u.userID);
    const pool = withId.length > 0 ? withId : users;
    return pool[Math.floor(Math.random() * pool.length)];
}

export function saveUser(user: UserRecord): void {
    const authDir = path.resolve('.auth');
    fs.mkdirSync(authDir, { recursive: true });

    const filePath = path.join(authDir, 'user.json');
    const parsed = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        : [];
    const existing = Array.isArray(parsed) ? parsed : [parsed];

    existing.push(user);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}
