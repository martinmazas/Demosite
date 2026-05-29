import * as fs from 'fs';
import * as path from 'path';

interface UserRecord {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
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
