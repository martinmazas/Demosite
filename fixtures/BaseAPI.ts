import { APIRequestContext } from '@playwright/test';
import type { Credentials, RegisterResponse, LoginResponse, UserId, UserProfileResponse, DeleteResponse } from '@/functions/types';
import type { BooksResponse, AddBooksResponse, RemoveBookResponse, Book } from '@/functions/books';

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

  protected async delete<T>(path: string, extraHeaders?: Record<string, string>, data?: unknown, expectedStatus = 200): Promise<T> {
    const res = await this.request.delete(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', ...extraHeaders },
      data,
    });

    if (res.status() !== expectedStatus) {
      throw new Error(`DELETE ${path} failed: ${res.status()} ${await res.text()}`);
    }
    const text = await res.text();
    return (text ? JSON.parse(text) : {}) as T;
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

  async deleteUser(userId: UserId, token: string): Promise<DeleteResponse> {
    return this.delete<DeleteResponse>(
      `Account/v1/User/${userId.userID}`,
      { Authorization: `Bearer ${token}` },
      undefined,
      204,
    );
  }

  async getUserProfile(userId: UserId, token: string): Promise<UserProfileResponse> {
    return this.get<UserProfileResponse>(`Account/v1/User/${userId.userID}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  async listBooks(): Promise<BooksResponse> {
    return this.get<BooksResponse>('BookStore/v1/Books');
  }

  async getBook(isbn: string): Promise<Book> {
    return this.get<Book>(`BookStore/v1/Book?ISBN=${isbn}`);
  }

  async clearCollection(userId: string, token: string): Promise<DeleteResponse> {
    return this.delete<DeleteResponse>(
      `BookStore/v1/Books?UserId=${userId}`,
      { Authorization: `Bearer ${token}` },
      undefined,
      204
    )
  }

  async addToCollection(userId: string, isbn: string, token: string): Promise<AddBooksResponse> {
    return this.post<AddBooksResponse>(
      'BookStore/v1/Books',
      { userId, collectionOfIsbns: [{ isbn }] },
      { Authorization: `Bearer ${token}` },
    );
  }

  async removeFromCollection(userId: string, isbn: string, token: string): Promise<RemoveBookResponse> {
    return this.delete<RemoveBookResponse>(
      'BookStore/v1/Book',
      { Authorization: `Bearer ${token}` },
      { isbn, userId },
      204
    );
  }
}
