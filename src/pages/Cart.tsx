
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();
  
  const handleIncreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeItem(productId);
    }
  };
  
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const handleApplyCoupon = () => {
    // In a real app, this would validate against the backend
    alert(`Coupon ${couponCode} applied!`);
    setCouponCode('');
  };
  
  // Shipping calculation - free over ₹999
  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shippingCost;
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button size="lg" asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell>
                        <div className="h-20 w-20 rounded overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/product/${item.product.id}`} className="hover:text-primary">
                          {item.product.name}
                        </Link>
                      </TableCell>
                      <TableCell>₹{item.product.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 
                      ? 'Free' 
                      : `₹${shippingCost.toLocaleString('en-IN')}`
                    }
                  </span>
                </div>
                
                <div className="flex justify-between py-2 text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="pt-4">
                  <Button size="lg" className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Apply Coupon Code</h4>
                <div className="flex">
                  <Input 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode}
                    className="rounded-l-none"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
