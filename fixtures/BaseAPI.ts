import { APIRequestContext } from '@playwright/test';
import type {
  Credentials,
  LoginResponse,
  RegisterResponse,
  ApiResponse,
  UserProfileResponse,
  BooksResponse,
  Book,
  AddBooksResponse,
  RemoveBookResponse,
} from '../functions/types';

export class BaseAPI {
  private readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  /**
   * @param request - Playwright API request context used for all HTTP calls.
   * Reads `API_BASE_URL` from the environment and normalises the trailing slash.
   */
  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = `${(process.env.API_BASE_URL ?? '').replace(/\/$/, '')}/`;
  }

  /**
   * Sends a GET request and deserialises the JSON body as `T`.
   * @param path - Path appended to `baseUrl` (no leading slash).
   * @param extraHeaders - Optional headers merged on top of the default `Accept` header.
   * @throws {Error} When the response status is not 2xx.
   */
  protected async get<T>(path: string, extraHeaders?: Record<string, string>): Promise<T> {
    const res = await this.request.get(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', ...extraHeaders },
    });
    return res.json() as Promise<T>;
  }

  /**
   * Sends a DELETE request and deserialises the response body as `T`.
   * Unlike `get`, the success check is an exact status match so callers can
   * expect 204 No Content responses (which have an empty body).
   * @param path - Path appended to `baseUrl`.
   * @param extraHeaders - Optional additional headers.
   * @param data - Optional request body (e.g. when the API requires a body on DELETE).
   * @param expectedStatus - HTTP status code that is considered success (default 200).
   * @throws {Error} When the response status does not match `expectedStatus`.
   */
  protected async delete<T>(path: string, extraHeaders?: Record<string, string>, data?: unknown): Promise<T> {
    const res = await this.request.delete(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', ...extraHeaders },
      data,
    });

    if (!res.ok()) {
      throw new Error(`DELETE ${path} failed: ${res.status()} ${await res.text()}`);
    }
    const text = await res.text();
    return (text ? JSON.parse(text) : {}) as T;
  }

  /**
   * Sends a POST request with a JSON body and deserialises the response as `T`.
   * @param path - Path appended to `baseUrl`.
   * @param data - Optional request body serialised as JSON.
   * @param extraHeaders - Optional headers merged on top of the defaults.
   * @throws {Error} When the response status is not 2xx.
   */
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

  async registerUser(userData: Credentials): Promise<RegisterResponse | ApiResponse> {
    const res = await this.request.post(`${this.baseUrl}Account/v1/User`, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      data: userData,
    });
    if (res.status() === 201) {
      return res.json() as Promise<RegisterResponse>;
    }
    return res.json() as Promise<ApiResponse>;
  }

  async generateToken(credentials: Credentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('Account/v1/GenerateToken', credentials);
  }
  async getUserProfile(userId: string, token: string): Promise<UserProfileResponse | ApiResponse> {
    return this.get<UserProfileResponse | ApiResponse>(`Account/v1/User/${userId}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  async deleteUser(userId: string, token: string): Promise<UserProfileResponse | ApiResponse> {
    return this.delete<UserProfileResponse | ApiResponse>(
      `Account/v1/User/${userId}`,
      { Authorization: `Bearer ${token}` },
      undefined,
    );
  }

  async listBooks(): Promise<BooksResponse> {
    return this.get<BooksResponse>('BookStore/v1/Books');
  }

  async getBook(isbn: string): Promise<Book> {
    return this.get<Book>(`BookStore/v1/Book?ISBN=${isbn}`);
  }

  async clearCollection(userId: string, token: string): Promise<ApiResponse> {
    return this.delete<ApiResponse>(
      `BookStore/v1/Books?UserId=${userId}`,
      { Authorization: `Bearer ${token}` },
      undefined,
    );
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
    );
  }
}
