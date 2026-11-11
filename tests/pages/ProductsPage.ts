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

  async addToCart(nombre: string): Promise<void> {
    await this.productCard(nombre).getByRole('button', { name: 'Add to cart' }).click();
  }

  /** Abre el detalle del producto haciendo clic sobre su nombre. */
  async openProduct(nombre: string): Promise<void> {
    await this.productName(nombre).click();
  }
}
