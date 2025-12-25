
import { Product, ProductCategory } from "@/types/product";

// Mock product data for demonstration
export const productData: Product[] = [
  {
    id: "1",
    name: "Hydrating Face Serum",
    description: "A lightweight serum that deeply hydrates and plumps the skin with hyaluronic acid and vitamin B5.",
    price: 1299,
    image: "/placeholder.svg",
    category: "Face Serum",
    stock: 25,
    rating: 4.7,
    numReviews: 128,
    featured: true,
    bestSeller: true
  },
  {
    id: "2",
    name: "Vitamin C Brightening Serum",
    description: "Powerful antioxidant serum that brightens skin tone, reduces hyperpigmentation, and boosts collagen production.",
    price: 1499,
    image: "/placeholder.svg",
    category: "Face Serum",
    stock: 18,
    rating: 4.9,
    numReviews: 94,
    featured: true
  },
  {
    id: "3",
    name: "Gentle Foaming Cleanser",
    description: "A gentle face wash that effectively removes impurities without stripping the skin's natural moisture.",
    price: 899,
    image: "/placeholder.svg",
    category: "Face Wash",
    stock: 32,
    rating: 4.5,
    numReviews: 76
  },
  {
    id: "4",
    name: "Exfoliating Face Wash",
    description: "Removes dead skin cells and unclogs pores with natural exfoliants for a smoother complexion.",
    price: 999,
    image: "/placeholder.svg",
    category: "Face Wash",
    stock: 22,
    rating: 4.6,
    numReviews: 63,
    bestSeller: true
  },
  {
    id: "5",
    name: "SPF 50 Lightweight Sunscreen",
    description: "Broad-spectrum protection with a lightweight formula that blends seamlessly into all skin tones.",
    price: 1199,
    image: "/placeholder.svg",
    category: "Sun Screen",
    stock: 15,
    rating: 4.8,
    numReviews: 105,
    featured: true
  },
  {
    id: "6",
    name: "Hydrating SPF 30 Sunscreen",
    description: "Daily protection with added hydration for dry skin types, enriched with niacinamide and ceramides.",
    price: 1099,
    image: "/placeholder.svg",
    category: "Sun Screen",
    stock: 20,
    rating: 4.4,
    numReviews: 89
  },
  {
    id: "7",
    name: "Retinol Repair Serum",
    description: "Night-time serum that diminishes fine lines and improves skin texture with stabilized retinol.",
    price: 1699,
    image: "/placeholder.svg",
    category: "Face Serum",
    stock: 12,
    rating: 4.7,
    numReviews: 72,
    new: true
  },
  {
    id: "8",
    name: "Oil Control Face Wash",
    description: "Balances oily skin and reduces shine without over-drying, featuring salicylic acid and tea tree oil.",
    price: 949,
    image: "/placeholder.svg",
    category: "Face Wash",
    stock: 28,
    rating: 4.3,
    numReviews: 54
  },
  {
    id: "9",
    name: "Tinted SPF 40 Sunscreen",
    description: "Light coverage with sun protection, perfect for a natural look while protecting your skin.",
    price: 1399,
    image: "/placeholder.svg",
    category: "Sun Screen",
    stock: 17,
    rating: 4.6,
    numReviews: 48,
    new: true
  }
];

// Function to get all products
export const getAllProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productData);
    }, 500); // Simulate network delay
  });
};

// Function to get a product by ID
export const getProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = productData.find((p) => p.id === id);
      resolve(product);
    }, 300); // Simulate network delay
  });
};

// Function to get products by category
export const getProductsByCategory = (category: ProductCategory): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = productData.filter((p) => p.category === category);
      resolve(products);
    }, 400); // Simulate network delay
  });
};

// Function to get featured products
export const getFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = productData.filter((p) => p.featured);
      resolve(products);
    }, 300); // Simulate network delay
  });
};

// Function to get best selling products
export const getBestSellingProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = productData.filter((p) => p.bestSeller);
      resolve(products);
    }, 300); // Simulate network delay
  });
};

// Function to get new products
export const getNewProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = productData.filter((p) => p.new);
      resolve(products);
    }, 300); // Simulate network delay
  });
};

// Function to search products
export const searchProducts = (searchTerm: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const products = productData.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
      resolve(products);
    }, 400); // Simulate network delay
  });
};
