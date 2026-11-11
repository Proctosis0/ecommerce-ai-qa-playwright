export interface Credenciales {
  username: string;
  password: string;
}

export interface Producto {
  nombre: string;
  precio: number;
  precioTexto: string;
}

/** Credenciales: variables de entorno con fallback a los usuarios publicos de SauceDemo. */
export const usuarios: Record<'standard' | 'locked', Credenciales> = {
  standard: {
    username: process.env.SAUCE_USER ?? 'standard_user',
    password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
  },
  locked: {
    username: process.env.SAUCE_LOCKED_USER ?? 'locked_out_user',
    password: process.env.SAUCE_LOCKED_PASSWORD ?? 'secret_sauce',
  },
};

/** Productos usados en los tests, con su precio como numero y como texto de la UI. */
export const productos: Record<'backpack' | 'bikeLight', Producto> = {
  backpack: { nombre: 'Sauce Labs Backpack', precio: 29.99, precioTexto: '$29.99' },
  bikeLight: { nombre: 'Sauce Labs Bike Light', precio: 9.99, precioTexto: '$9.99' },
};

/** Rutas internas (la URL base vive solo en playwright.config.ts como baseURL). */
export const urls = {
  login: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
} as const;

export const api = {
  producto: 'https://cursotesting.com.ar:3000/producto/',
} as const;
