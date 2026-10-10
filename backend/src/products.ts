export interface RawProduct {
  id: number;
  title: string;
  price: number;
  category?: string;
}

export interface CleanProduct {
  id: number;
  title: string;
  price: number;
  category: string;
}

export function isValid(product: RawProduct): boolean {
  return product.price > 0 && product.title.trim().length > 0;
}

export function cleanProduct(product: RawProduct): CleanProduct {
  const cleanProduct: CleanProduct = {
    id: product.id,
    title: product.title.trim(),
    price: product.price,
    category: product.category?.toLowerCase() ?? "uncategorized",
  };

  return cleanProduct;
}
