import { APIRequestContext, Page, expect } from '@playwright/test';

export interface Book {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
}

export interface BooksResponse {
  books: Book[];
}

function isPage(context: APIRequestContext | Page): context is Page {
  return 'goto' in context;
}

export async function getBooks(context: APIRequestContext | Page): Promise<BooksResponse> {
  const api = isPage(context) ? context.request : context;
  const response = await api.get('/BookStore/v1/Books');
  expect(response.status()).toBe(200);
  return response.json() as Promise<BooksResponse>;
}