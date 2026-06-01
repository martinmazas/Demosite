import { APIRequestContext } from '@playwright/test';

export class BaseAPI {
  private readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = `${(process.env.API_BASE_URL ?? '').replace(/\/$/, '')}/`;
  }

  protected async get<T>(path: string): Promise<T> {
    const res = await this.request.get(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok()) {
      throw new Error(`GET ${path} failed: ${res.status()} ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  }

  protected async post<T>(path: string, data?: unknown): Promise<T> {
    const res = await this.request.post(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      data,
    });
    if (!res.ok()) {
      throw new Error(`POST ${path} failed: ${res.status()} ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  }
}
