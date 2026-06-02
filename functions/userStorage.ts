import * as fs from 'fs';
import * as path from 'path';
import type { UserRecord } from './types';

/**
 * Returns the last entry in `.auth/user.json` that has a non-empty `userID`.
 * Useful for retrieving the most recently registered test user.
 * @throws {Error} When the file contains no valid user records.
 */
export function getLastUser(): UserRecord {
    const filePath = path.join(path.resolve('.auth'), 'user.json');
    const users: UserRecord[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const pool = users.filter(u => u.userID);
    if (pool.length === 0) throw new Error('No users found in user.json');
    return pool[pool.length - 1];
}

/**
 * Removes the user with the given `userID` from `.auth/user.json`.
 * Reads the entire file, filters out the matching record, and rewrites it.
 */
export function removeUser(userID: string): void {
    const filePath = path.join(path.resolve('.auth'), 'user.json');
    const users: UserRecord[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    fs.writeFileSync(filePath, JSON.stringify(users.filter(u => u.userID !== userID), null, 2));
}

/**
 * Appends a user record to `.auth/user.json`, creating the file and directory
 * if they don't exist yet. Handles the case where the file currently contains
 * a single object (not an array) by wrapping it before appending.
 */
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
