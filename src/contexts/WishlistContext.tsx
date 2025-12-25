
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Product } from '@/types/product';

type WishlistContextType = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load wishlist from local storage on component mount or user change
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`skinAuraWishlist_${user.id}`);
      if (savedWishlist) {
        try {
          setItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Failed to parse saved wishlist:', error);
        }
      }
    } else {
      // Clear wishlist when user logs out
      setItems([]);
    }
  }, [user]);

  // Save wishlist to local storage whenever it changes
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`skinAuraWishlist_${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  // Add an item to the wishlist
  const addItem = (product: Product) => {
    // Check if item already in wishlist
    if (!isInWishlist(product.id)) {
      setItems(prevItems => [...prevItems, product]);
      
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    } else {
      toast({
        title: "Already in Wishlist",
        description: `${product.name} is already in your wishlist.`,
      });
    }
  };

  // Remove an item from wishlist
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    toast({
      title: "Item Removed",
      description: "The item has been removed from your wishlist.",
    });
  };

  // Clear wishlist
  const clearWishlist = () => {
    setItems([]);
    if (user) {
      localStorage.removeItem(`skinAuraWishlist_${user.id}`);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const value = {
    items,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
