import { APIRequestContext } from '@playwright/test';
import type { BooksResponse, AddBooksResponse, Book, RemoveBookResponse, ApiResponse } from './types';
export type { Book, BooksResponse, AddBooksPayload, AddBooksResponse, RemoveBookResponse } from './types';
import { BaseAPI } from '@/fixtures/BaseAPI';

export async function listBooks(context: APIRequestContext): Promise<BooksResponse> {
  return new BaseAPI(context).listBooks();
}

export async function getBook(api: APIRequestContext, isbn: string): Promise<Book> {
  return new BaseAPI(api).getBook(isbn);
}

export async function addToCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<AddBooksResponse> {
  return new BaseAPI(api).addToCollection(userId, isbn, token);
}

export async function removeFromCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<RemoveBookResponse> {
  return new BaseAPI(api).removeFromCollection(userId, isbn, token);
}

export async function clearCollection(api: APIRequestContext, userId: string, token: string): Promise<ApiResponse> {
  return new BaseAPI(api).clearCollection(userId, token);
}