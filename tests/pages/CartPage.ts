import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Pantalla del carrito de compras. */
export class CartPage extends BasePage {
  readonly list: Locator;
  readonly items: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.list = page.getByTestId('cart-list');
    this.items = page.getByTestId('inventory-item');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
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

  /** Boton Remove de un producto dentro del carrito. */
  itemButton(nombre: string): Locator {
    return this.itemCard(nombre).getByRole('button', { name: 'Remove' });
  }

  /** Quita del carrito el producto indicado. */
  async removeItem(nombre: string): Promise<void> {
    await this.itemCard(nombre).getByRole('button', { name: 'Remove' }).click();
  }

  /** Vuelve a la pagina de productos desde el carrito. */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
