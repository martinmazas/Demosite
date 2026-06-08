import { APIRequestContext, Page, expect } from '@playwright/test';
import type {
  Credentials,
  RegisterResponse,
  ApiResponse,
  LoginResponse,
  UserProfileResponse,
  UserData
} from './types';
import { BaseAPI } from '../fixtures/BaseAPI';
import { RegisterPage } from '../pages/RegisterPage';
import { isPage } from './utils';

export async function registerUser(api: APIRequestContext, userData: Credentials): Promise<RegisterResponse | ApiResponse>;
export async function registerUser(page: RegisterPage, userData: UserData): Promise<void>;
export async function registerUser(
  context: APIRequestContext | RegisterPage,
  userData: Credentials | UserData
): Promise<RegisterResponse | ApiResponse | void> {
  if (!isPage(context)) {
    return new BaseAPI(context).registerUser(userData as Credentials);
  }

  const { firstName, lastName, username, password } = userData as UserData;
  await context.register(firstName, lastName, username, password);
}

export async function generateToken(api: APIRequestContext, credentials: Credentials): Promise<LoginResponse> {
  return new BaseAPI(api).generateToken(credentials);
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
