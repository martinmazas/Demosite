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

  async getUserId(): Promise<string> {
    const userInfo = await this.page.evaluate(() =>
      JSON.parse(localStorage.getItem('userInfo') || '{}')
    );
    return userInfo.userId;
  }

  async getUserData(): Promise<UserData> {
    const api = await this.getAPI();
    const userId = await this.getUserId();
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
