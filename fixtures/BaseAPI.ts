import { APIRequestContext } from '@playwright/test';
import type { Credentials, RegisterResponse, LoginResponse, UserId, UserProfileResponse, DeleteResponse } from '@/functions/types';
import type { BooksResponse, AddBooksResponse, RemoveBookResponse, Book } from '@/functions/books';

class BaseAPI {
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
    if (!res.ok()) {
      throw new Error(`GET ${path} failed: ${res.status()} ${await res.text()}`);
    }
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
}

export class AuthAPI extends BaseAPI {
  async generateToken(credentials: Credentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('Account/v1/GenerateToken', credentials);
  }

  async registerUser(userData: Credentials): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('Account/v1/User', userData);
  }

  /** Deletes a user account. Expects a 204 No Content response. */
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

  /** Removes all books from a user's collection. Expects a 204 No Content response. */
  async clearCollection(userId: string, token: string): Promise<DeleteResponse> {
    return this.delete<DeleteResponse>(
      `BookStore/v1/Books?UserId=${userId}`,
      { Authorization: `Bearer ${token}` },
      undefined,
      204
    )
  }

  /**
   * Adds a single book to a user's collection.
   * The API accepts a list, but this wrapper always sends exactly one ISBN.
   */
  async addToCollection(userId: string, isbn: string, token: string): Promise<AddBooksResponse> {
    return this.post<AddBooksResponse>(
      'BookStore/v1/Books',
      { userId, collectionOfIsbns: [{ isbn }] },
      { Authorization: `Bearer ${token}` },
    );
  }

  /** Removes a single book from a user's collection. Expects a 204 No Content response. */
  async removeFromCollection(userId: string, isbn: string, token: string): Promise<RemoveBookResponse> {
    return this.delete<RemoveBookResponse>(
      'BookStore/v1/Book',
      { Authorization: `Bearer ${token}` },
      { isbn, userId },
      204
    );
  }
}
