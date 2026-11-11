const { BasePage } = require('./BasePage');

/**
 * Pantalla del carrito de compras.
 */
class CartPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.list = page.locator('[data-test="cart-list"]');
    this.items = page.locator('[data-test="inventory-item"]');
  }

  /**
   * Contenedor exacto de un producto dentro del carrito.
   * @param {string} nombre
   */
  itemCard(nombre) {
    return this.items.filter({ hasText: nombre });
  }

  /** @param {string} nombre */
  itemName(nombre) {
    return this.itemCard(nombre).locator('[data-test="inventory-item-name"]');
  }

  /** @param {string} nombre */
  itemPrice(nombre) {
    return this.itemCard(nombre).locator('[data-test="inventory-item-price"]');
  }
}

module.exports = { CartPage };
