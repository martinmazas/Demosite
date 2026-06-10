import { BasePage } from '@/fixtures/BasePage';
import { APIRequestContext, Page } from '@playwright/test';
import { generateUserData } from './testData';
import { Credentials } from './types';

/**
 * Type guard that narrows `context` to `Page`. Uses `instanceof BasePage`
 * because `APIRequestContext` never extends `BasePage`, making it a reliable
 * discriminator between the two union members.
 */
export function isPage(context: APIRequestContext | Page): context is Page {
  return context instanceof BasePage;
}

export function createCredentials() {
  const { username, password } = generateUserData();
  return { credentials: { userName: username, password } as Credentials };
}
