
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Product } from '@/types/product';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart from local storage on component mount or user change
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`skinAuraCart_${user.id}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse saved cart:', error);
        }
      }
    } else {
      // Clear cart when user logs out
      setItems([]);
    }
  }, [user]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`skinAuraCart_${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  // Calculate total number of items in cart
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price of items in cart
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Add an item to the cart
  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      // Check if item already in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new
        return [...prevItems, { product, quantity }];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Update quantity of an item in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove an item from cart
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    if (user) {
      localStorage.removeItem(`skinAuraCart_${user.id}`);
    }
  };

  // Check if a product is in the cart
  const isInCart = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const value = {
    items,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
