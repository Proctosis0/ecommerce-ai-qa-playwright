import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Pantalla de inventario de productos. */
export class ProductsPage extends BasePage {
  readonly list: Locator;
  readonly items: Locator;
  readonly detailName: Locator;
  readonly detailPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.list = page.getByTestId('inventory-list');
    this.items = page.getByTestId('inventory-item');
    this.detailName = page.getByTestId('inventory-item-name');
    this.detailPrice = page.getByTestId('inventory-item-price');
  }

  /** Abre el inventario directamente (requiere sesion iniciada, ej. via storageState). */
  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /** Selector de orden del listado. */
  get sortSelect(): Locator {
    return this.page.getByTestId('product-sort-container');
  }

  /** Ordena el listado: 'az' | 'za' | 'lohi' | 'hilo'. */
  async sortBy(orden: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(orden);
  }

  /** Precios del listado en el orden en que se muestran, como numeros. */
  async visiblePrices(): Promise<number[]> {
    const textos = await this.items.getByTestId('inventory-item-price').allTextContents();
    return textos.map((t) => Number(t.replace('$', '')));
  }

  /** Atributo src de la imagen de cada producto, en el orden del listado. */
  async imageSources(): Promise<string[]> {
    return this.items.locator('img').evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src') ?? ''));
  }

  /** Contenedor exacto de un producto del listado. */
  productCard(nombre: string): Locator {
    return this.items.filter({ hasText: nombre });
  }

  productName(nombre: string): Locator {
    return this.productCard(nombre).getByTestId('inventory-item-name');
  }

  productPrice(nombre: string): Locator {
    return this.productCard(nombre).getByTestId('inventory-item-price');
  }

  /** Boton de accion de la tarjeta: "Add to cart" o "Remove" segun el estado. */
  productButton(nombre: string): Locator {
    return this.productCard(nombre).locator('button');
  }

  async addToCart(nombre: string): Promise<void> {
    await this.productCard(nombre).getByRole('button', { name: 'Add to cart' }).click();
  }

  /** Quita del carrito el producto indicado desde el listado de productos. */
  async removeFromCart(nombre: string): Promise<void> {
    await this.productCard(nombre).getByRole('button', { name: 'Remove' }).click();
  }

  /** Abre el detalle del producto haciendo clic sobre su nombre. */
  async openProduct(nombre: string): Promise<void> {
    await this.productName(nombre).click();
  }
}
