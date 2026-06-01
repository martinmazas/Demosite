import { BaseAPI } from './BaseAPI';
import type { Credentials, RegisterResponse, LoginResponse } from '@/functions/auth';

export class AuthAPI extends BaseAPI {
  async generateToken(credentials: Credentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('Account/v1/GenerateToken', credentials);
  }

  async registerUser(userData: Credentials): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('Account/v1/User', userData);
  }
}