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
export const usuarios: Record<'standard' | 'locked' | 'problem', Credenciales> = {
  problem: {
    username: process.env.SAUCE_PROBLEM_USER ?? 'problem_user',
    password: process.env.SAUCE_PROBLEM_PASSWORD ?? 'secret_sauce',
  },
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
  checkoutInfo: '/checkout-step-one.html',
  checkoutOverview: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
} as const;

export interface DatosCheckout {
  caso: string;
  nombre: string;
  apellido: string;
  codigoPostal: string;
  error: string;
}

/** Casos negativos del formulario de checkout (un campo obligatorio vacio por caso). */
export const checkoutInvalido: DatosCheckout[] = [
  { caso: 'todos los campos vacios', nombre: '', apellido: '', codigoPostal: '', error: 'Error: First Name is required' },
  { caso: 'sin nombre', nombre: '', apellido: 'Perez', codigoPostal: '1000', error: 'Error: First Name is required' },
  { caso: 'sin apellido', nombre: 'Juan', apellido: '', codigoPostal: '1000', error: 'Error: Last Name is required' },
  { caso: 'sin codigo postal', nombre: 'Juan', apellido: 'Perez', codigoPostal: '', error: 'Error: Postal Code is required' },
];

/** Datos validos para completar una compra. */
export const checkoutValido = { nombre: 'Juan', apellido: 'Perez', codigoPostal: '1000' } as const;

/** Resumen esperado al comprar solo el Backpack (precio + 8% de impuesto que aplica SauceDemo). */
export const resumenBackpack = {
  subtotal: 'Item total: $29.99',
  impuesto: 'Tax: $2.40',
  total: 'Total: $32.39',
} as const;

export const api = {
  producto: 'https://cursotesting.com.ar:3000/producto/',
} as const;
