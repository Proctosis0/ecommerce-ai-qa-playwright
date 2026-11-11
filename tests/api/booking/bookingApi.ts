import type { APIRequestContext, APIResponse } from '@playwright/test';
import { bookingApi } from '../../../data/test-data';
import type { Booking } from './bookingSchemas';

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

/** Cliente minimo de la API Restful-Booker. Devuelve siempre la respuesta completa. */
export class BookingApi {
  constructor(private readonly request: APIRequestContext) {}

  private url(path: string): string {
    return `${bookingApi.baseUrl}${path}`;
  }

  private auth(token: string): Record<string, string> {
    return { ...JSON_HEADERS, Cookie: `token=${token}` };
  }

  createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post(this.url('/auth'), { headers: JSON_HEADERS, data: { username, password } });
  }

  /** Obtiene un token valido o falla con un mensaje claro. */
  async token(): Promise<string> {
    const res = await this.createToken(bookingApi.admin.username, bookingApi.admin.password);
    const body = await res.json();
    if (!body.token) throw new Error(`No se pudo obtener token: ${JSON.stringify(body)}`);
    return body.token;
  }

  list(): Promise<APIResponse> {
    return this.request.get(this.url('/booking'), { headers: JSON_HEADERS });
  }

  create(data: Partial<Booking> | Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(this.url('/booking'), { headers: JSON_HEADERS, data });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(this.url(`/booking/${id}`), { headers: JSON_HEADERS });
  }

  update(id: number, data: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(this.url(`/booking/${id}`), {
      headers: token ? this.auth(token) : JSON_HEADERS,
      data,
    });
  }

  patch(id: number, data: Partial<Booking>, token: string): Promise<APIResponse> {
    return this.request.patch(this.url(`/booking/${id}`), { headers: this.auth(token), data });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(this.url(`/booking/${id}`), {
      headers: token ? this.auth(token) : JSON_HEADERS,
    });
  }
}
