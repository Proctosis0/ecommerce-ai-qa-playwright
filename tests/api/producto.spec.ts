import { test, expect } from '../fixtures';
import { productos } from '../../data/test-data';
import { getPrecio } from './productoApi';

test.describe('API de productos', { tag: '@SCRUM-11' }, () => {
  test('devuelve el precio de Sauce Labs Backpack', async ({ request }) => {
    const respuesta = await getPrecio(request, productos.backpack.nombre);

    expect(respuesta.ok(), `La API debe responder OK (status ${respuesta.status()})`).toBeTruthy();

    const cuerpo = await respuesta.json();
    expect(cuerpo, 'La respuesta debe incluir la propiedad precio').toHaveProperty('precio');
    expect(typeof cuerpo.precio, 'El precio debe ser un numero').toBe('number');
    expect(cuerpo.precio, 'El precio del producto debe ser 29.99').toBe(productos.backpack.precio);
  });

  test('devuelve error para un producto inexistente', { tag: ['@bug', '@SCRUM-16'] }, async ({ request }) => {
    test.fail(true, 'Bug: la API responde 200 con {"precio":0} para un producto inexistente');
    test.info().annotations.push({
      type: 'bug',
      description:
        'La API deberia responder 404 (o un error) cuando el producto no existe; hoy devuelve 200 con precio 0.',
    });

    const respuesta = await getPrecio(request, 'Producto Inexistente');

    expect(respuesta.status(), 'Un producto inexistente deberia devolver 404').toBe(404);
  });
});
