import { APIRequestContext, Page, expect } from '@playwright/test';
import type {
  Credentials,
  RegisterResponse,
  ApiResponse,
  LoginResponse,
  UserProfileResponse,
} from './types';
import { BaseAPI } from '../fixtures/BaseAPI';
import { RegisterPage } from '../pages/RegisterPage';
import { isPage } from './utils';

// export async function registerUser(api: APIRequestContext, userData: Credentials): Promise<RegisterResponse | ApiResponse>;
// export async function registerUser(page: RegisterPage, userData: UserData): Promise<void>;
export async function registerUser(
  context: APIRequestContext,
  userData: Credentials
): Promise<RegisterResponse | ApiResponse | void> {
  // if (!isPage(context)) {
  return new BaseAPI(context).registerUser(userData);
  // }

  // const { firstName, lastName, username, password } = userData as UserData;
  // await context.register(firstName, lastName, username, password);
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
