import { BaseAPI } from './BaseAPI';
import type { Credentials, RegisterPayload, RegisterResponse, LoginResponse } from '@/functions/auth';

export class AuthAPI extends BaseAPI {
  async generateToken(credentials: Credentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('Account/v1/GenerateToken', credentials);
  }

  async registerUser(userData: RegisterPayload): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('Account/v1/User', userData);
  }
}