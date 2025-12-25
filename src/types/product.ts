
export type ProductCategory = 'Face Serum' | 'Face Wash' | 'Sun Screen';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  stock: number;
  rating: number;
  numReviews: number;
  featured?: boolean;
  bestSeller?: boolean;
  new?: boolean;
};

export type ProductFilter = {
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price-low-high' | 'price-high-low' | 'newest' | 'popularity';
  searchTerm?: string;
};
