import { APIRequestContext, Page, expect } from '@playwright/test';
import type { BooksResponse, AddBooksResponse, Book, RemoveBookResponse, DeleteResponse } from './types';
export type { Book, BooksResponse, AddBooksPayload, AddBooksResponse, RemoveBookResponse } from './types';

/** Type guard: returns `true` when `context` is a Playwright `Page`. */
function isPage(context: APIRequestContext | Page): context is Page {
  return typeof (context as any).goto === 'function';
}

export async function listBooks(context: APIRequestContext | Page): Promise<BooksResponse> {
  const api = isPage(context) ? context.request : context;
  const response = await api.get('/BookStore/v1/Books');
  expect(response.status()).toBe(200);
  return response.json() as Promise<BooksResponse>;
}

export async function getBook(api: APIRequestContext, isbn: string): Promise<Book> {
  const response = await api.get(`/BookStore/v1/Book?ISBN=${isbn}`);
  expect(response.status()).toBe(200);
  return response.json() as Promise<Book>;
}

export async function addToCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<AddBooksResponse> {
  const response = await api.post('/BookStore/v1/Books', {
    data: { userId, collectionOfIsbns: [{ isbn }] },
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.status()).toBe(201);
  return response.json() as Promise<AddBooksResponse>;
}

export async function removeFromCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<RemoveBookResponse> {
  const response = await api.delete('/BookStore/v1/Book', {
    data: { isbn, userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.status()).toBe(204);
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as RemoveBookResponse;
}

export async function clearCollection(api: APIRequestContext, userId: string, token: string): Promise<DeleteResponse> {
  const response = await api.delete(`/BookStore/v1/Books?UserId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.status()).toBe(204);
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as DeleteResponse;
}