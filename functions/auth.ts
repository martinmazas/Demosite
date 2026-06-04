import { APIRequestContext, Page, expect } from '@playwright/test';
import type {
  Credentials,
  RegisterPayload,
  UserId,
  RegisterResponse,
  LoginResponse,
} from './types';

/** Type guard: returns `true` when `context` is a Playwright `Page`. */
function isPage(context: APIRequestContext | Page): context is Page {
  return 'goto' in context;
}

/**
 * Creates a new user account.
 * Accepts either a raw `APIRequestContext` or a `Page` (the request context is
 * extracted automatically). Asserts a 201 response status.
 */
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

/**
 * Authenticates a user and returns a JWT token.
 * Accepts either a raw `APIRequestContext` or a `Page`. Asserts a 200 status.
 */
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

/**
 * Retrieves a user's profile by ID.
 * Accepts either a raw `APIRequestContext` or a `Page`. Asserts a 200 status.
 */
export async function getUserProfile(
  context: APIRequestContext | Page,
  userID: string
): Promise<RegisterResponse> {
  const api = isPage(context) ? context.request : context;
  const response = await api.get(`Account/v1/user/${userID}`);
  expect(response.status()).toBe(200);
  return response.json() as Promise<RegisterResponse>
}
