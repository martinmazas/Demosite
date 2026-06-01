import { APIRequestContext } from '@playwright/test';
import type { Credentials, RegisterResponse, LoginResponse, UserId, UserProfileResponse, DeleteUserResponse } from '@/functions/auth';
import type { BooksResponse, AddBooksResponse } from '@/functions/books';

class BaseAPI {
  private readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = `${(process.env.API_BASE_URL ?? '').replace(/\/$/, '')}/`;
  }

  protected async get<T>(path: string, extraHeaders?: Record<string, string>): Promise<T> {
    const res = await this.request.get(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', ...extraHeaders },
    });
    if (!res.ok()) {
      throw new Error(`GET ${path} failed: ${res.status()} ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  }

  protected async delete<T>(path: string, extraHeaders?: Record<string, string>): Promise<T> {
    const res = await this.request.delete(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', ...extraHeaders },
    });
    if (res.status() !== 200) {
      throw new Error(`DELETE ${path} failed: ${res.status()} ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  }

  protected async post<T>(path: string, data?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    const res = await this.request.post(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...extraHeaders },
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

  async deleteUser(userId: UserId, token: string): Promise<DeleteUserResponse> {
    return this.delete<DeleteUserResponse>(`Account/v1/User/${userId.userID}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  async getUserProfile(userId: UserId, token: string): Promise<UserProfileResponse> {
    return this.get<UserProfileResponse>(`Account/v1/User/${userId.userID}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  async getBooks(): Promise<BooksResponse> {
    return this.get<BooksResponse>('BookStore/v1/Books');
  }

  async addBooksToCollection(userId: string, isbn: string, token: string): Promise<AddBooksResponse> {
    return this.post<AddBooksResponse>(
      'BookStore/v1/Books',
      { userId, collectionOfIsbns: [{ isbn }] },
      { Authorization: `Bearer ${token}` },
    );
  }
}
