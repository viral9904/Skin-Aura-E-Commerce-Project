
import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '@/data/products';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="bg-skinAura-lavender/20 py-16">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully selected products designed to transform your skincare routine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button className="px-8" asChild>
            <a href="/products">View All Products</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
