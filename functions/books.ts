import { APIRequestContext, Page, expect } from '@playwright/test';
import type { BooksResponse, AddBooksResponse, Credentials } from './types';
import { AuthAPI } from '@/fixtures/BaseAPI';
export type { Book, BooksResponse, AddBooksPayload, AddBooksResponse, RemoveBookResponse } from './types';

/** Type guard: returns `true` when `context` is a Playwright `Page`. */
function isPage(context: APIRequestContext | Page): context is Page {
  return typeof (context as any).goto === 'function';
}

/**
 * Fetches the full list of books from the BookStore API.
 * Accepts either a raw `APIRequestContext` or a `Page`. Asserts a 200 status.
 */
export async function listBooks(context: APIRequestContext | Page): Promise<BooksResponse> {
  const api = isPage(context) ? context.request : context;
  const response = await api.get('/BookStore/v1/Books');
  expect(response.status()).toBe(200);
  return response.json() as Promise<BooksResponse>;
}

export async function addToCollection(api: AuthAPI, userId: string, isbn: string, credentials: Credentials): Promise<AddBooksResponse> {
  const { token } = await api.generateToken(credentials);
  return api.addToCollection(userId, isbn, token);
}