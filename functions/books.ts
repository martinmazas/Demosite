import { APIRequestContext, Page, expect } from '@playwright/test';
import type { BooksResponse } from './types';
export type { Book, BooksResponse, AddBooksPayload, AddBooksResponse, RemoveBookResponse } from './types';

function isPage(context: APIRequestContext | Page): context is Page {
  return 'goto' in context;
}

export async function getBooks(context: APIRequestContext | Page): Promise<BooksResponse> {
  const api = isPage(context) ? context.request : context;
  const response = await api.get('/BookStore/v1/Books');
  expect(response.status()).toBe(200);
  return response.json() as Promise<BooksResponse>;
}