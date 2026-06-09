import { APIRequestContext } from '@playwright/test';
import type { BooksResponse, Book, RemoveBookResponse, ApiResponse } from './types';
import { BaseAPI } from '@/fixtures/BaseAPI';
import { BookPage } from '@/pages/BookPage';
import { isPage } from './utils';

export async function listBooks(context: APIRequestContext): Promise<BooksResponse>;
export async function listBooks(context: BookPage): Promise<BooksResponse>;
export async function listBooks(context: APIRequestContext | BookPage): Promise<BooksResponse> {
    if (isPage(context)) return context.getBooks();
    return new BaseAPI(context).listBooks();
}

export async function getBook(api: APIRequestContext, isbn: string): Promise<Book | ApiResponse> {
    return new BaseAPI(api).getBook(isbn);
}

export async function addToCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<BooksResponse> {
    return new BaseAPI(api, token).addToCollection(userId, isbn);
}

export async function removeFromCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<RemoveBookResponse> {
    return new BaseAPI(api, token).removeFromCollection(userId, isbn);
}

export async function clearCollection(api: APIRequestContext, userId: string, token: string): Promise<ApiResponse> {
    return new BaseAPI(api, token).clearCollection(userId);
}