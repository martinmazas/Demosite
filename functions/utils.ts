import { APIRequestContext, Page } from '@playwright/test';

export function isPage(context: APIRequestContext | Page): context is Page {
  return typeof (context as any).goto === 'function';
}
