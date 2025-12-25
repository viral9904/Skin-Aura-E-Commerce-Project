
import { Product } from './product';

export type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
};

export type PaymentMethod = 'COD' | 'Online' | 'GPay' | 'PhonePe' | 'Razorpay';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  notes?: string;
};
