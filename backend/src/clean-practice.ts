const rawProducts: RawProduct[] = [
  { id: 1, title: "  Wireless Mouse ", price: 25.5, category: "ELECTRONICS" },
  { id: 2, title: "", price: 10, category: "toys" },
  { id: 3, title: "Desk Lamp", price: -5, category: "Home" },
  { id: 4, title: "Notebook", price: 3.2 },
];

interface RawProduct{
    id: number;
    title: string;
    price: number;
    category?: string;
}

interface CleanProduct{
    id: number;
    title: string;
    price: number;
    category: string;
}

function isValid(product: RawProduct): boolean{
    return product.price >= 0 && product.title.trim().length > 0;
}

function cleanProduct(product: RawProduct): CleanProduct{
    const cleanProduct: CleanProduct = {id: product.id, title: product.title.trim(), price: product.price, category: product.category?.toLowerCase() ?? "uncategorized"};

    return cleanProduct;
}

const cleaned: CleanProduct[] = [];
const rejected: string[] = [];

for(const product of rawProducts){
    if(isValid(product)){
        cleaned.push(cleanProduct(product));
    } else{
        rejected.push(`Product ${product.id} rejected: invalid title or price.`);
    }
}

console.log("Accepted: " + cleaned.length);
console.log("Accepted: " + rejected.length);

for(const message of rejected){
    console.log(message);
}

console.log(cleaned.map((x) => x.title).join(', '));
console.log(cleaned.reduce((sum, x) => sum + x.price, 0).toFixed(2));
console.log(cleaned.filter((x) => x.price > 10).map((x) => x.title));