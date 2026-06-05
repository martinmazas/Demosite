import { APIRequestContext, Page, expect } from '@playwright/test';
import type {
  Credentials,
  RegisterResponse,
  LoginResponse,
  ApiResponse,
  UserProfileResponse,
} from './types';
import { BaseAPI } from '../fixtures/BaseAPI';

/** Type guard: returns `true` when `context` is a Playwright `Page`. */
function isPage(context: APIRequestContext | Page): context is Page {
  return typeof (context as any).goto === 'function';
}

export async function registerUser(api: APIRequestContext, userData: Credentials): Promise<RegisterResponse | ApiResponse>;
export async function registerUser(page: Page, userData: Credentials): Promise<RegisterResponse | ApiResponse>;
export async function registerUser(
  context: APIRequestContext | Page,
  userData: Credentials
): Promise<RegisterResponse | ApiResponse> {
  if (!isPage(context)) {
    return new BaseAPI(context).registerUser(userData);
  }

  const response = await context.request.post('/Account/v1/User', { data: userData });
  if (response.status() === 201) {
    return response.json() as Promise<RegisterResponse>;
  }
  return response.json() as Promise<ApiResponse>;
}

export async function generateToken(api: APIRequestContext, credentials: Credentials): Promise<LoginResponse>;
export async function generateToken(page: Page, credentials: Credentials): Promise<LoginResponse>;
export async function generateToken(
  context: APIRequestContext | Page,
  credentials: Credentials
): Promise<LoginResponse> {
  if (!isPage(context)) {
    return new BaseAPI(context).generateToken(credentials);
  }
  const response = await context.request.post('/Account/v1/GenerateToken', { data: credentials });
  expect(response.status()).toBe(200);
  return response.json() as Promise<LoginResponse>;
}

export async function getUserProfile(
  api: APIRequestContext,
  userID: string,
  token: string
): Promise<UserProfileResponse | ApiResponse> {
  return new BaseAPI(api).getUserProfile(userID, token);
}

export async function deleteUser(
  api: APIRequestContext,
  token: string,
  userId: string
): Promise<ApiResponse | UserProfileResponse> {
  return new BaseAPI(api).deleteUser(userId, token);
}
