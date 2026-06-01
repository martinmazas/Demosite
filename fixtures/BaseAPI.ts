import { APIRequestContext } from '@playwright/test';
import type { Credentials, RegisterResponse, LoginResponse } from '@/functions/auth';

class BaseAPI {
  private readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = `${(process.env.API_BASE_URL ?? '').replace(/\/$/, '')}/`;
  }

  protected async get<T>(path: string): Promise<T> {
    const res = await this.request.get(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok()) {
      throw new Error(`GET ${path} failed: ${res.status()} ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  }

  protected async post<T>(path: string, data?: unknown): Promise<T> {
    const res = await this.request.post(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      data,
    });
    if (!res.ok()) {
      throw new Error(`POST ${path} failed: ${res.status()} ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  }
}

export class AuthAPI extends BaseAPI {
  async generateToken(credentials: Credentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('Account/v1/GenerateToken', credentials);
  }

  async registerUser(userData: Credentials): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('Account/v1/User', userData);
  }
}
