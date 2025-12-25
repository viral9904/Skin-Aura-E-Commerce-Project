
import { useState, useEffect } from 'react';
import { getBestSellingProducts } from '@/data/products';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const BestSellingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const bestSellers = await getBestSellingProducts();
        setProducts(bestSellers);
      } catch (error) {
        console.error('Error loading best selling products:', error);
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
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Best Selling Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most popular products loved by customers for their exceptional results.
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

export default BestSellingProducts;
