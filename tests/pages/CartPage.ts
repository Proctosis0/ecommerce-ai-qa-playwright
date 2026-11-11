import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Pantalla del carrito de compras. */
export class CartPage extends BasePage {
  readonly list: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.list = page.getByTestId('cart-list');
    this.items = page.getByTestId('inventory-item');
  }

  /** Contenedor exacto de un producto dentro del carrito. */
  itemCard(nombre: string): Locator {
    return this.items.filter({ hasText: nombre });
  }

  itemName(nombre: string): Locator {
    return this.itemCard(nombre).getByTestId('inventory-item-name');
  }

  itemPrice(nombre: string): Locator {
    return this.itemCard(nombre).getByTestId('inventory-item-price');
  }
}
