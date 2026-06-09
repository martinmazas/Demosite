import { BasePage } from '@/fixtures/BasePage';
import { APIRequestContext, Page } from '@playwright/test';

export function isPage(context: APIRequestContext | Page): context is Page {
  return context instanceof BasePage;
}
