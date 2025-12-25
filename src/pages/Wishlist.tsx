

import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem, isInCart } = useCart();

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleAddToCart = (productId: string) => {
    const product = items.find(item => item.id === productId);
    if (product) {
      addItem(product, 1);
    }
  };

  return (
    
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-6">
              Save items you love to your wishlist and they'll appear here.
            </p>
            <Button size="lg" asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-20 w-20 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/product/${product.id}`} className="hover:text-primary">
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        {product.stock > 0 ? (
                          <span className="text-green-600">In Stock</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            disabled={product.stock === 0 || isInCart(product.id)}
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveItem(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </div>
   
  );
};

export default Wishlist;
