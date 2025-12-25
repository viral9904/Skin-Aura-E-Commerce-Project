
import { useState, useEffect } from 'react';

import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/components/product/ProductFilter';
import { getAllProducts } from '@/data/products';
import { Product, ProductFilter as FilterType } from '@/types/product';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>({
    category: 'all',
    minPrice: 0,
    maxPrice: 2000,
    inStock: false,
    sortBy: 'popularity',
    searchTerm: '',
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        applyFilters(allProducts, filter);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const applyFilters = (productList: Product[], currentFilter: FilterType) => {
    let result = [...productList];

    // Apply category filter
    if (currentFilter.category && currentFilter.category !== 'all') {
      result = result.filter(p => p.category === currentFilter.category);
    }

    // Apply price range filter
    if (currentFilter.minPrice !== undefined || currentFilter.maxPrice !== undefined) {
      result = result.filter(p => {
        const minPrice = currentFilter.minPrice !== undefined ? currentFilter.minPrice : 0;
        const maxPrice = currentFilter.maxPrice !== undefined ? currentFilter.maxPrice : Infinity;
        return p.price >= minPrice && p.price <= maxPrice;
      });
    }

    // Apply in-stock filter
    if (currentFilter.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Apply search term filter
    if (currentFilter.searchTerm) {
      const term = currentFilter.searchTerm.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (currentFilter.sortBy) {
      switch (currentFilter.sortBy) {
        case 'price-low-high':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // For mock data, we don't have actual dates, so this is just an example
          result = result.filter(p => p.new).concat(result.filter(p => !p.new));
          break;
        case 'popularity':
        default:
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    setFilteredProducts(result);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    applyFilters(products, updatedFilter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const updatedFilter = { ...filter, searchTerm };
    setFilter(updatedFilter);
    applyFilters(products, updatedFilter);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
  
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        
        {/* Search and mobile filter toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search products..."
              value={filter.searchTerm || ''}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button 
            variant="outline"
            className="md:hidden flex items-center"
            onClick={toggleMobileFilter}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter sidebar */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden flex">
              <div className="bg-white w-80 h-full overflow-y-auto p-6 ml-auto animate-slide-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={toggleMobileFilter}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <ProductFilter onFilterChange={handleFilterChange} initialFilter={filter} />
              </div>
            </div>
          )}

          {/* Desktop filter sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <ProductFilter onFilterChange={handleFilterChange} initialFilter={filter} />
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Showing {filteredProducts.length} products
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default Products;
