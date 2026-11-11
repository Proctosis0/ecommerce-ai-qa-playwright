const { BasePage } = require('./BasePage');

/**
 * Pantalla de inventario de productos.
 */
class ProductsPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.list = page.locator('[data-test="inventory-list"]');
    this.items = page.locator('[data-test="inventory-item"]');
  }

  /**
   * Contenedor exacto de un producto del listado.
   * @param {string} nombre
   */
  productCard(nombre) {
    return this.items.filter({ hasText: nombre });
  }

  /** @param {string} nombre */
  productName(nombre) {
    return this.productCard(nombre).locator('[data-test="inventory-item-name"]');
  }

  /** @param {string} nombre */
  productPrice(nombre) {
    return this.productCard(nombre).locator('[data-test="inventory-item-price"]');
  }

  /** @param {string} nombre */
  async addToCart(nombre) {
    await this.productCard(nombre).getByRole('button', { name: 'Add to cart' }).click();
  }
}

module.exports = { ProductsPage };
