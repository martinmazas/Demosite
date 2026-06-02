import * as fs from 'fs';
import * as path from 'path';

interface UserRecord {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    userID?: string;
}

export function getLastUser(): UserRecord {
    const filePath = path.join(path.resolve('.auth'), 'user.json');
    const users: UserRecord[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const pool = users.filter(u => u.userID);
    if (pool.length === 0) throw new Error('No users found in user.json');
    return pool[pool.length - 1];
}

export function removeUser(userID: string): void {
    const filePath = path.join(path.resolve('.auth'), 'user.json');
    const users: UserRecord[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    fs.writeFileSync(filePath, JSON.stringify(users.filter(u => u.userID !== userID), null, 2));
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
