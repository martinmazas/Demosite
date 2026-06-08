import { APIRequestContext } from '@playwright/test';
import type { BooksResponse, Book, RemoveBookResponse, ApiResponse, AddBooksPayload } from './types';
import { BaseAPI } from '@/fixtures/BaseAPI';

export async function listBooks(context: APIRequestContext): Promise<BooksResponse> {
    return new BaseAPI(context).listBooks();
}

export async function getBook(api: APIRequestContext, isbn: string): Promise<Book | ApiResponse> {
    return new BaseAPI(api).getBook(isbn);
}

export async function addToCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<BooksResponse> {
    return new BaseAPI(api).addToCollection(userId, isbn, token);
}

export async function removeFromCollection(api: APIRequestContext, userId: string, isbn: string, token: string): Promise<RemoveBookResponse> {
    return new BaseAPI(api).removeFromCollection(userId, isbn, token);
}

export async function clearCollection(api: APIRequestContext, userId: string, token: string): Promise<ApiResponse> {
    return new BaseAPI(api).clearCollection(userId, token);
}