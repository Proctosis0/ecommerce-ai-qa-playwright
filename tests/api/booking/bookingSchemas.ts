import { z } from 'zod';

/** Contrato de una reserva de Restful-Booker. */
export const bookingSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    totalprice: z.number(),
    depositpaid: z.boolean(),
    bookingdates: z.object({
      checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'checkin debe ser AAAA-MM-DD'),
      checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'checkout debe ser AAAA-MM-DD'),
    }),
    additionalneeds: z.string().optional(),
  })
  .strict();

/** Respuesta de POST /booking. */
export const createBookingResponseSchema = z
  .object({
    bookingid: z.number().int().positive(),
    booking: bookingSchema,
  })
  .strict();

/** Respuesta de POST /auth con credenciales validas. */
export const authResponseSchema = z.object({ token: z.string().min(1) }).strict();

/** Elemento de GET /booking (listado de ids). */
export const bookingIdListSchema = z.array(z.object({ bookingid: z.number().int() }));

export type Booking = z.infer<typeof bookingSchema>;
