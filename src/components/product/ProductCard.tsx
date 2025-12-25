
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addItem, isInCart } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const productInCart = isInCart(product.id);
  const productInWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    
    addItem(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    
    if (productInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card rounded-lg overflow-hidden h-full flex flex-col">
        <div className="relative">
          <div className="h-64 overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Product badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.bestSeller && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                Best Seller
              </Badge>
            )}
            {product.new && (
              <Badge className="bg-green-500 text-white">
                New
              </Badge>
            )}
          </div>
          
          {/* Wishlist button */}
          <Button
            size="icon"
            variant="secondary"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
              productInWishlist ? 'text-red-500' : 'text-gray-600'
            } ${isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0 md:opacity-0'} transition-opacity`}
            onClick={handleWishlistToggle}
          >
            <Heart className="h-4 w-4" fill={productInWishlist ? "currentColor" : "none"} />
          </Button>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium text-lg text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          
          <div className="text-sm text-gray-600 mb-3 line-clamp-2">{product.category}</div>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="text-yellow-500">{'★'.repeat(Math.round(product.rating))}</span>
              <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
          </div>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="font-semibold">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            <Button
              size="sm"
              variant={productInCart ? "secondary" : "default"}
              className="ml-2"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              {productInCart ? 'In Cart' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
