import { test as base, expect } from '../../fixtures';
import { bookingApi as config, reservaValida } from '../../../data/test-data';
import { BookingApi } from './bookingApi';
import {
  authResponseSchema,
  bookingIdListSchema,
  bookingSchema,
  createBookingResponseSchema,
  type Booking,
} from './bookingSchemas';

/**
 * Suite de API sobre Restful-Booker: autenticacion, CRUD de reservas, permisos y contrato (Zod).
 * Cada test crea sus propios datos y la fixture `nuevaReserva` los borra al terminar,
 * para no depender del estado de una API publica compartida.
 */
const test = base.extend<{ api: BookingApi; token: string; nuevaReserva: (datos?: Booking) => Promise<number> }>({
  api: async ({ request }, use) => {
    await use(new BookingApi(request));
  },
  token: async ({ api }, use) => {
    await use(await api.token());
  },
  nuevaReserva: async ({ api, token }, use) => {
    const creadas: number[] = [];
    await use(async (datos = reservaValida) => {
      const res = await api.create(datos);
      expect(res.ok(), `La creacion de la reserva debe responder OK (status ${res.status()})`).toBeTruthy();
      const id = (await res.json()).bookingid as number;
      creadas.push(id);
      return id;
    });
    // Limpieza: borra las reservas creadas por el test
    for (const id of creadas) await api.delete(id, token);
  },
});

test.describe('API Restful-Booker: autenticacion', { tag: '@SCRUM-12' }, () => {
  test('POST /auth con credenciales validas devuelve un token', async ({ api }) => {
    const res = await api.createToken(config.admin.username, config.admin.password);

    expect(res.status(), 'POST /auth debe responder 200').toBe(200);
    const body = await res.json();
    expect(authResponseSchema.safeParse(body).success, 'La respuesta debe cumplir el contrato { token }').toBe(true);
  });

  test('BUG-05: POST /auth con credenciales invalidas debe responder 401', { tag: ['@bug', '@SCRUM-17'] }, async ({ api }) => {
    test.fail(true, 'Bug conocido de Restful-Booker');
    test.info().annotations.push({
      type: 'bug',
      description: 'Con credenciales invalidas responde 200 con {"reason":"Bad credentials"}; deberia responder 401.',
    });

    const res = await api.createToken(config.admin.username, 'clave-incorrecta');

    expect(res.status(), 'Credenciales invalidas deben responder 401 Unauthorized').toBe(401);
  });
});

test.describe('API Restful-Booker: CRUD de reservas', { tag: '@SCRUM-12' }, () => {
  test('POST /booking crea una reserva y cumple el contrato', async ({ api, token }) => {
    const res = await api.create(reservaValida);

    expect(res.status(), 'POST /booking debe responder 200').toBe(200);
    const body = await res.json();
    const contrato = createBookingResponseSchema.safeParse(body);
    expect(contrato.success, `La respuesta debe cumplir el contrato: ${contrato.error?.message ?? ''}`).toBe(true);
    expect(body.booking, 'La reserva devuelta debe coincidir con los datos enviados').toEqual(reservaValida);

    await api.delete(body.bookingid, token);
  });

  test('GET /booking/{id} devuelve la reserva creada', async ({ api, nuevaReserva }) => {
    const id = await nuevaReserva();

    const res = await api.get(id);

    expect(res.status(), 'GET /booking/{id} debe responder 200').toBe(200);
    const body = await res.json();
    expect(bookingSchema.safeParse(body).success, 'La reserva debe cumplir el contrato').toBe(true);
    expect(body, 'La reserva consultada debe ser igual a la creada').toEqual(reservaValida);
  });

  test('GET /booking lista ids e incluye la reserva creada', async ({ api, nuevaReserva }) => {
    const id = await nuevaReserva();

    const res = await api.list();

    expect(res.status(), 'GET /booking debe responder 200').toBe(200);
    const body = await res.json();
    expect(bookingIdListSchema.safeParse(body).success, 'El listado debe ser [{ bookingid }]').toBe(true);
    expect(body.map((b: { bookingid: number }) => b.bookingid), 'El listado debe incluir la reserva creada').toContain(id);
  });

  test('PUT /booking/{id} con token actualiza todos los campos', async ({ api, token, nuevaReserva }) => {
    const id = await nuevaReserva();
    const cambios: Booking = {
      ...reservaValida,
      lastname: 'Actualizado',
      totalprice: 300,
      bookingdates: { checkin: '2026-12-10', checkout: '2026-12-15' },
    };

    const res = await api.update(id, cambios, token);

    expect(res.status(), 'PUT /booking/{id} debe responder 200').toBe(200);
    expect(await res.json(), 'La respuesta debe reflejar los cambios').toEqual(cambios);
    expect(await (await api.get(id)).json(), 'Los cambios deben persistir').toEqual(cambios);
  });

  test('PATCH /booking/{id} modifica solo el campo enviado', async ({ api, token, nuevaReserva }) => {
    const id = await nuevaReserva();

    const res = await api.patch(id, { totalprice: 999 }, token);

    expect(res.status(), 'PATCH /booking/{id} debe responder 200').toBe(200);
    expect(await res.json(), 'Solo debe cambiar totalprice').toEqual({ ...reservaValida, totalprice: 999 });
  });

  test('DELETE /booking/{id} con token borra la reserva', async ({ api, token }) => {
    const id = (await (await api.create(reservaValida)).json()).bookingid;

    await api.delete(id, token);

    expect((await api.get(id)).status(), 'La reserva borrada no debe existir (404)').toBe(404);
  });
});

test.describe('API Restful-Booker: permisos', { tag: '@SCRUM-12' }, () => {
  test('PUT sin token es rechazado con 403', async ({ api, nuevaReserva }) => {
    const id = await nuevaReserva();

    const res = await api.update(id, { ...reservaValida, lastname: 'Sin permiso' });

    expect(res.status(), 'Modificar sin token debe responder 403 Forbidden').toBe(403);
    expect((await (await api.get(id)).json()).lastname, 'La reserva no debe cambiar').toBe(reservaValida.lastname);
  });

  test('DELETE sin token es rechazado con 403', async ({ api, nuevaReserva }) => {
    const id = await nuevaReserva();

    const res = await api.delete(id);

    expect(res.status(), 'Borrar sin token debe responder 403 Forbidden').toBe(403);
    expect((await api.get(id)).status(), 'La reserva debe seguir existiendo').toBe(200);
  });
});

test.describe('API Restful-Booker: defectos de validacion', { tag: '@SCRUM-12' }, () => {
  test('BUG-06: crear una reserva sin campos obligatorios debe responder 400', { tag: ['@bug', '@SCRUM-18'] }, async ({ api }) => {
    test.fail(true, 'Bug conocido de Restful-Booker');
    test.info().annotations.push({
      type: 'bug',
      description: 'Un POST /booking con solo "firstname" responde 500 Internal Server Error; deberia ser 400 Bad Request.',
    });

    const res = await api.create({ firstname: 'Incompleta' });

    expect(res.status(), 'Datos incompletos deben responder 400 Bad Request').toBe(400);
  });

  test('BUG-07: no debe aceptar precio negativo ni salida anterior a la entrada', { tag: ['@bug', '@SCRUM-19'] }, async ({ api, token }) => {
    test.fail(true, 'Bug conocido de Restful-Booker');
    test.info().annotations.push({
      type: 'bug',
      description: 'Acepta totalprice negativo y checkout anterior a checkin y crea la reserva (200); deberia rechazarla con 400.',
    });

    const res = await api.create({
      ...reservaValida,
      totalprice: -50,
      bookingdates: { checkin: '2026-12-10', checkout: '2026-12-01' },
    });
    const body = await res.json().catch(() => ({}));
    if (body.bookingid) await api.delete(body.bookingid, token); // limpieza si el bug la creo

    expect(res.status(), 'Una reserva invalida debe ser rechazada con 400').toBe(400);
  });

  test('BUG-08: DELETE exitoso debe responder 200 o 204, no 201', { tag: ['@bug', '@SCRUM-20'] }, async ({ api, token }) => {
    test.fail(true, 'Bug conocido de Restful-Booker');
    test.info().annotations.push({
      type: 'bug',
      description: 'DELETE /booking/{id} responde 201 Created; para un borrado lo correcto es 200 OK o 204 No Content.',
    });

    const id = (await (await api.create(reservaValida)).json()).bookingid;

    const res = await api.delete(id, token);

    expect([200, 204], 'Un borrado exitoso debe responder 200 o 204').toContain(res.status());
  });
});
