import type { Product, ProductList } from '@repo/types';

interface FetchProductsOptions {
  shuffle?: boolean;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Fetches products from the API with optional shuffling and Next.js caching support.
 */
export async function fetchProducts(options: FetchProductsOptions = {}): Promise<ProductList> {
  const { shuffle = false, next = { revalidate: 300, tags: ['products'] } } = options;

  const res = await fetch(
    'https://dummyjson.com/products?limit=30&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images',
    {
      next,
    } as RequestInit,
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const data: ProductList = await res.json();

  if (!shuffle) {
    return data;
  }

  // Shuffle first 10 for content variation (evidences ISR is working)
  const products = [...data.products];
  const top10 = products.splice(0, 10);

  for (let i = top10.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top10[i], top10[j]] = [top10[j] as Product, top10[i] as Product];
  }

  const shuffled = [...top10, ...products];

  // biome-ignore lint/suspicious/noConsoleLog: intentional ISR content-change marker
  console.log(
    `[ISR] Products cache refreshed at ${new Date().toISOString()} — first item: ${shuffled[0]?.title}`,
  );

  return { ...data, products: shuffled };
}
