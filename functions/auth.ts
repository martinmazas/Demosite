import { APIRequestContext, Page, expect } from '@playwright/test';

export interface Credentials {
    userName: string;
    password: string;
}

export interface RegisterPayload extends Credentials {
    firstName: string;
    lastName: string;
}
export type LoginPayload = RegisterPayload;
export interface RegisterResponse {
    userID: string;
    username: string;
    books: Array<{ isbn: string }>;
}
export interface LoginResponse {
    token: string;
    expires: string;
    status: string;
    result: string;
}
function isPage(context: APIRequestContext | Page): context is Page {
    return 'goto' in context;
}

export async function registerUser(api: APIRequestContext, userData: RegisterPayload): Promise<RegisterResponse>;
export async function registerUser(page: Page, userData: RegisterPayload): Promise<RegisterResponse>;
export async function registerUser(
    context: APIRequestContext | Page,
    userData: RegisterPayload
): Promise<RegisterResponse> {
    const api = isPage(context) ? context.request : context;
    const response = await api.post('/Account/v1/User', { data: userData });
    expect(response.status()).toBe(201);
    return response.json() as Promise<RegisterResponse>;
}

export async function generateToken(api: APIRequestContext, credentials: Credentials): Promise<LoginResponse> {
    const response = await api.post('/Account/v1/GenerateToken', { data: credentials });
    expect(response.status()).toBe(200);
    return response.json() as Promise<LoginResponse>;
}
