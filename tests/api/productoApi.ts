import type { APIRequestContext, APIResponse } from '@playwright/test';
import { api } from '../../data/test-data';

/** Consulta el precio de un producto en la API. Devuelve la respuesta completa. */
export async function getPrecio(request: APIRequestContext, nombre: string): Promise<APIResponse> {
  return request.post(api.producto, { data: { nombre } });
}
