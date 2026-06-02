import { APIRequestContext, Locator, Page } from '@playwright/test';
type AriaRole = Parameters<Page['getByRole']>[0];

export interface UserData {
  userId: string;
  username: string;
  books: Array<{ isbn: string }>;
}

export class BasePage {
  protected readonly page: Page;
  private api: APIRequestContext | null = null;

  /**
   * @param page - Playwright `Page` instance.
   *
   * Returns a `Proxy` so that any property not defined on this class is
   * transparently forwarded to the underlying `Page` object. This lets
   * subclasses be used directly as if they were `Page` instances without
   * explicit delegation boilerplate.
   */
  constructor(page: Page) {
    this.page = page;

    return new Proxy(this, {
      get(target, prop: string | symbol, receiver) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        const val = Reflect.get(page as object, prop);
        return typeof val === 'function' ? val.bind(page) : val;
      },
    });
  }

  /**
   * Returns a lazily-initialised `APIRequestContext` authenticated with the
   * token stored in `localStorage.userInfo`. On first call it reads the token,
   * injects it as a global `Authorization` header on the browser context, and
   * caches the result so subsequent calls skip the localStorage read.
   */
  async getAPI(): Promise<APIRequestContext> {
    if (this.api) return this.api;

    const userInfo = await this.page.evaluate(() =>
      JSON.parse(localStorage.getItem('userInfo') || '{}')
    );

    await this.page.context().setExtraHTTPHeaders({
      Authorization: `Bearer ${userInfo.token}`,
    });

    const api = this.page.context().request;
    this.api = api;
    return api;
  }

  /** Reads the current user's ID from `localStorage.userInfo`. */
  async getUserId(): Promise<string> {
    const userInfo = await this.page.evaluate(() =>
      JSON.parse(localStorage.getItem('userInfo') || '{}')
    );
    return userInfo.userId;
  }

  /**
   * Fetches the full profile of the currently logged-in user from the API.
   * Combines `getAPI()` and `getUserId()` then hits the Account endpoint.
   */
  async getUserData(): Promise<UserData> {
    const api = await this.getAPI();
    const userId = await this.getUserId();
    console.log(userId);
    const response = await api.get(`/Account/v1/User/${userId}`);
    return response.json() as Promise<UserData>;
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  findByRole(role: AriaRole, name: string): Locator {
    return this.page.getByRole(role, { name });
  }
}

export interface BasePage extends Page { }
