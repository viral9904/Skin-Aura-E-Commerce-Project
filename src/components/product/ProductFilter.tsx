
import { useState } from 'react';
import { ProductFilter as FilterType, ProductCategory } from '@/types/product';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ProductFilterProps {
  onFilterChange: (filter: FilterType) => void;
  initialFilter?: FilterType;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilterChange,
  initialFilter = {},
}) => {
  const [filter, setFilter] = useState<FilterType>({
    category: initialFilter.category || 'all',
    minPrice: initialFilter.minPrice || 0,
    maxPrice: initialFilter.maxPrice || 2000,
    inStock: initialFilter.inStock || false,
    sortBy: initialFilter.sortBy || 'popularity',
  });

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    const newFilter = { ...filter, category };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilter = { ...filter, minPrice: value[0], maxPrice: value[1] };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleInStockChange = (checked: boolean) => {
    const newFilter = { ...filter, inStock: checked };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleSortByChange = (sortBy: FilterType['sortBy']) => {
    const newFilter = { ...filter, sortBy };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleReset = () => {
    const resetFilter: FilterType = {
      category: 'all',
      minPrice: 0,
      maxPrice: 2000,
      inStock: false,
      sortBy: 'popularity',
    };
    setFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-3">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="all"
              name="category"
              checked={filter.category === 'all'}
              onChange={() => handleCategoryChange('all')}
              className="mr-2"
            />
            <Label htmlFor="all">All Products</Label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="face-serum"
              name="category"
              checked={filter.category === 'Face Serum'}
              onChange={() => handleCategoryChange('Face Serum')}
              className="mr-2"
            />
            <Label htmlFor="face-serum">Face Serum</Label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="face-wash"
              name="category"
              checked={filter.category === 'Face Wash'}
              onChange={() => handleCategoryChange('Face Wash')}
              className="mr-2"
            />
            <Label htmlFor="face-wash">Face Wash</Label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="sun-screen"
              name="category"
              checked={filter.category === 'Sun Screen'}
              onChange={() => handleCategoryChange('Sun Screen')}
              className="mr-2"
            />
            <Label htmlFor="sun-screen">Sun Screen</Label>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[filter.minPrice || 0, filter.maxPrice || 2000]}
            max={2000}
            step={50}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>₹{filter.minPrice}</span>
            <span>₹{filter.maxPrice}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-3">Availability</h3>
        <div className="flex items-center">
          <Checkbox
            id="in-stock"
            checked={filter.inStock}
            onCheckedChange={handleInStockChange}
          />
          <Label htmlFor="in-stock" className="ml-2">
            In Stock Only
          </Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-3">Sort By</h3>
        <RadioGroup
          value={filter.sortBy}
          onValueChange={(value) => handleSortByChange(value as FilterType['sortBy'])}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="popularity" id="popularity" />
            <Label htmlFor="popularity">Popularity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-low-high" id="price-low-high" />
            <Label htmlFor="price-low-high">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-high-low" id="price-high-low" />
            <Label htmlFor="price-high-low">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest">Newest First</Label>
          </div>
        </RadioGroup>
      </div>

      <Button variant="outline" className="w-full" onClick={handleReset}>
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
