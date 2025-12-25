
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { Product } from '@/types/product';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { 
  Minus, 
  Plus, 
  Heart, 
  Share2, 
  ShoppingBag, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, isInCart } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          navigate('/products');
          toast({
            title: "Product Not Found",
            description: "The product you're looking for doesn't exist.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleIncrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    addItem(product, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'SkinAura Product',
        text: product?.description || 'Check out this amazing product!',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="h-screen flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const isProductInCart = isInCart(product.id);
  const isProductInWishlist = isInWishlist(product.id);

  return (
    <PageLayout>
      <div className="container-custom py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category.toLowerCase().replace(' ', '-')}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="sticky top-24">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product badges */}
              <div className="flex flex-wrap gap-2 mt-4">
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
                {product.featured && (
                  <Badge variant="outline">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <div className="text-yellow-500">{'★'.repeat(Math.round(product.rating))}</div>
                <div className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</div>
                <span className="ml-1 text-sm text-gray-500">({product.numReviews} reviews)</span>
              </div>
              <div className="text-sm text-gray-500">Category: {product.category}</div>
            </div>
            
            <div className="text-2xl font-semibold mb-6">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Stock Status</h3>
              {product.stock > 0 ? (
                <p className="text-green-600">In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
            
            {product.stock > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isProductInCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {isProductInCart ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className={`flex-1 ${isProductInWishlist ? 'text-red-500' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className="mr-2 h-5 w-5" fill={isProductInWishlist ? "currentColor" : "none"} />
                  {isProductInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
                
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
