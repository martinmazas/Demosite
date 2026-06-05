import { APIRequestContext, Page, expect } from '@playwright/test';
import type {
  Credentials,
  RegisterResponse,
  LoginResponse,
  DeleteResponse,
  UserProfileResponse,
} from './types';

/** Type guard: returns `true` when `context` is a Playwright `Page`. */
function isPage(context: APIRequestContext | Page): context is Page {
  return typeof (context as any).goto === 'function';
}

export async function registerUser(api: APIRequestContext, userData: Credentials): Promise<RegisterResponse>;
export async function registerUser(page: Page, userData: Credentials): Promise<RegisterResponse>;
export async function registerUser(
  context: APIRequestContext | Page,
  userData: Credentials
): Promise<RegisterResponse> {
  const api = isPage(context) ? context.request : context;
  const response = await api.post('/Account/v1/User', { data: userData });
  expect(response.status()).toBe(201);
  return response.json() as Promise<RegisterResponse>;
}

export async function generateToken(api: APIRequestContext, credentials: Credentials): Promise<LoginResponse>;
export async function generateToken(page: Page, credentials: Credentials): Promise<LoginResponse>;
export async function generateToken(
  context: APIRequestContext | Page,
  credentials: Credentials
): Promise<LoginResponse> {
  const api = isPage(context) ? context.request : context;
  const response = await api.post('/Account/v1/GenerateToken', { data: credentials });
  expect(response.status()).toBe(200);
  return response.json() as Promise<LoginResponse>;
}

export async function getUserProfile(
  api: APIRequestContext,
  userID: string,
  token: string
): Promise<UserProfileResponse | DeleteResponse> {
  const response = await api.get(`/Account/v1/User/${userID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok()) {
    return response.json() as Promise<UserProfileResponse>;
  }
  return response.json() as Promise<DeleteResponse>;
}

export async function deleteUser(
  api: APIRequestContext,
  token: string,
  userId: string
): Promise<DeleteResponse> {
  const response = await api.delete(`/Account/v1/User/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.status()).toBe(204);
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as DeleteResponse;
}
