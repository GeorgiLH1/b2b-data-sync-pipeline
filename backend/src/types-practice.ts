interface Product {
  id: number;
  title: string;
  price: number;
  category?: string; // the ? means the field is optional
}

const products: Product[] = [
  { id: 1, title: "book", price: 20.4, category: "small" },
  { id: 2, title: "car", price: 34500, category: "big" },
  { id: 3, title: "PC", price: 1200 },
];

function formatProduct(product: Product): string {
  return `${product.title} + ${product.price} + (${product.category ?? "undefined"})`;
}

function findCheapest(items: Product[]): Product | undefined {
  let cheapest: Product | undefined = undefined;

  for (const item of items) {
    if (cheapest === undefined || item.price < cheapest.price) {
      cheapest = item;
    }
  }

  return cheapest;
}

for (const product of products) {
  console.log(formatProduct(product));
}

const cheapest = findCheapest(products);
if (cheapest !== undefined) {
  console.log("Cheapest:", formatProduct(cheapest));
} else {
  console.log("No products");
}
