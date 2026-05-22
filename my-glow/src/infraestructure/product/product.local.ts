import type { Product } from "../../domain/product/product.type";

const CURRENT_PRODUCT_KEY = "current-product-v1";

export function saveCurrentProduct(product: Product): void {
  localStorage.setItem(CURRENT_PRODUCT_KEY, JSON.stringify(product));
}

export function loadCurrentProduct(): Product | null {
  const raw = localStorage.getItem(CURRENT_PRODUCT_KEY);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as Product;
}

export function clearCurrentProduct(): void {
  localStorage.removeItem(CURRENT_PRODUCT_KEY);
}
