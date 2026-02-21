export interface Product {
  readonly id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: readonly string[];
}

export interface ProductReview {
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}

export interface ProductDetail extends Product {
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  reviews: readonly ProductReview[];
}

export interface ProductList {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
