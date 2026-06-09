import { APIRequestContext } from '@playwright/test';
import type {
  Credentials,
  RegisterResponse,
  ApiResponse,
  LoginResponse,
  UserProfileResponse,
  UserData
} from './types';
import { BaseAPI } from '../fixtures/BaseAPI';
import { isPage } from './utils';
import { BasePage } from '@/fixtures/BasePage';
import { RegisterPage } from '@/pages/RegisterPage';

export async function registerUser(api: APIRequestContext, userData: Credentials): Promise<RegisterResponse | ApiResponse>;
export async function registerUser(page: BasePage, userData: UserData): Promise<void>;
export async function registerUser(
  context: APIRequestContext | BasePage,
  userData: Credentials | UserData
): Promise<RegisterResponse | ApiResponse | void> {
  if (!isPage(context)) {
    return new BaseAPI(context as APIRequestContext).registerUser(userData as Credentials);
  }

  const { firstName, lastName, username, password } = userData as UserData;
  await (context as RegisterPage).register(firstName, lastName, username, password);
}

export async function generateToken(api: APIRequestContext, credentials: Credentials): Promise<LoginResponse> {
  return new BaseAPI(api).generateToken(credentials);
}

export async function  getUserProfile(
  api: APIRequestContext,
  userID: string,
  token: string
): Promise<UserProfileResponse | ApiResponse> {
  return new BaseAPI(api, token).getUserProfile(userID);
}

export async function deleteUser(
  api: APIRequestContext,
  token: string,
  userId: string
): Promise<ApiResponse> {
  return new BaseAPI(api, token).deleteUser(userId);
}
