
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, CreditCard, Truck, Download, MapPin } from 'lucide-react';
import { ShippingAddress, PaymentMethod } from '@/types/order';
import { Address } from '@/types/user';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Shipping calculation - free over ₹999
  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shippingCost;

  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Online');
  const [notes, setNotes] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isOrdered, setIsOrdered] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderDate, setOrderDate] = useState<string>('');
  const [orderItems, setOrderItems] = useState<typeof items>([]);

  // Check if we're viewing a confirmed order (coming back from navigation)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('confirmed') === 'true') {
      const storedOrderId = localStorage.getItem('lastOrderId');
      const storedOrderDate = localStorage.getItem('lastOrderDate');
      const storedOrderItems = localStorage.getItem('lastOrderItems');
      const storedShippingAddress = localStorage.getItem('lastShippingAddress');
      const storedPaymentMethod = localStorage.getItem('lastPaymentMethod');
      
      if (storedOrderId && storedOrderDate && storedOrderItems && storedShippingAddress && storedPaymentMethod) {
        setOrderId(storedOrderId);
        setOrderDate(storedOrderDate);
        setOrderItems(JSON.parse(storedOrderItems));
        setShippingAddress(JSON.parse(storedShippingAddress));
        setPaymentMethod(JSON.parse(storedPaymentMethod) as PaymentMethod);
        setIsOrdered(true);
      }
    }
  }, [location]);

  // Load saved addresses
  useEffect(() => {
    if (user) {
      const savedAddressesStr = localStorage.getItem(`skinAuraAddresses_${user.id}`);
      if (savedAddressesStr) {
        try {
          const addresses = JSON.parse(savedAddressesStr);
          setSavedAddresses(addresses);
          
          // Find default address
          const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            fillAddressForm(defaultAddress);
          }
        } catch (error) {
          console.error('Failed to parse saved addresses:', error);
        }
      }
    }
  }, [user]);

  const fillAddressForm = (address: Address) => {
    setShippingAddress({
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phoneNumber: address.phoneNumber,
    });
    
    // Clear any form errors
    setFormErrors({});
  };

  const handleSavedAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    
    if (addressId === 'new') {
      // New address, clear the form
      setShippingAddress({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
      });
    } else {
      // Find the selected address and fill the form
      const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
      if (selectedAddress) {
        fillAddressForm(selectedAddress);
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'phoneNumber'];
    
    requiredFields.forEach(field => {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        errors[field] = 'This field is required';
      }
    });

    // Phone number validation
    if (shippingAddress.phoneNumber && !/^\d{10}$/.test(shippingAddress.phoneNumber.replace(/\s+/g, ''))) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // Zip code validation
    if (shippingAddress.zipCode && !/^\d{6}$/.test(shippingAddress.zipCode.replace(/\s+/g, ''))) {
      errors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fill all required fields",
        description: "Some fields need to be completed before placing your order.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a random order ID
    const newOrderId = 'ORD-' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    const newOrderDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Save order data to localStorage to preserve across page reloads
    localStorage.setItem('lastOrderId', newOrderId);
    localStorage.setItem('lastOrderDate', newOrderDate);
    localStorage.setItem('lastOrderItems', JSON.stringify(items));
    localStorage.setItem('lastShippingAddress', JSON.stringify(shippingAddress));
    localStorage.setItem('lastPaymentMethod', JSON.stringify(paymentMethod));
    
    setOrderId(newOrderId);
    setOrderDate(newOrderDate);
    setOrderItems(items); // Store items at time of order
    setIsOrdered(true);

    // Update URL to indicate we're on the confirmation page
    navigate('/checkout?confirmed=true', { replace: true });

    // In a real app, we would send the order to the backend
    toast({
      title: "Order Placed Successfully!",
      description: `Your order ${newOrderId} has been placed successfully.`,
    });

    // Clear the cart after successful order
    clearCart();
  };

  const handleDownloadInvoice = () => {
    if (!orderId || !orderDate) return;
    
    const itemsToUse = orderItems.length > 0 ? orderItems : items;
    const actualSubtotal = itemsToUse.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const actualShippingCost = actualSubtotal >= 999 ? 0 : 99;
    const actualGrandTotal = actualSubtotal + actualShippingCost;
    
    // Create PDF using jspdf
    const pdf = generateInvoicePDF(
      orderId,
      orderDate,
      itemsToUse,
      shippingAddress,
      actualSubtotal,
      actualShippingCost,
      actualGrandTotal,
      paymentMethod
    );
    
    // Save the PDF
    pdf.save(`invoice-${orderId}.pdf`);
    
    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded as a PDF.",
    });
  };

  if (isOrdered && orderId) {
    // Calculate actual values based on the ordered items
    const actualItems = orderItems.length > 0 ? orderItems : items;
    const actualSubtotal = actualItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const actualShippingCost = actualSubtotal >= 999 ? 0 : 99;
    const actualGrandTotal = actualSubtotal + actualShippingCost;
    
    return (
      <div className="container-custom py-12">
        <div className="max-w-xl mx-auto text-center">
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-lg mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <h2 className="font-semibold text-xl mb-4">Order Details</h2>
            <p className="mb-2"><span className="font-medium">Order ID:</span> {orderId}</p>
            <p className="mb-2"><span className="font-medium">Date:</span> {orderDate}</p>
            <p className="mb-2"><span className="font-medium">Total Amount:</span> ₹{actualGrandTotal.toLocaleString('en-IN')}</p>
            <p className="mb-2"><span className="font-medium">Shipping Address:</span> {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}</p>
            <p className="mb-2"><span className="font-medium">Name:</span> {shippingAddress.fullName}</p>
            <p className="mb-2"><span className="font-medium">Phone:</span> {shippingAddress.phoneNumber}</p>
            <p><span className="font-medium">Payment Method:</span> {paymentMethod}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" onClick={handleDownloadInvoice}>
              <Download className="mr-2 h-4 w-4" /> Download Invoice
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                {/* Saved Addresses Select */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <Label htmlFor="savedAddress" className="mb-2 block">Select a saved address</Label>
                    <Select 
                      value={selectedAddressId} 
                      onValueChange={handleSavedAddressSelect}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an address" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedAddresses.map(address => (
                          <SelectItem key={address.id} value={address.id}>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>{address.fullName} - {address.city}</span> 
                              {address.isDefault && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className="flex items-center text-primary">
                            <span>Enter a new address</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      className={formErrors.fullName ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.fullName && <p className="text-sm text-red-500">{formErrors.fullName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber"
                      value={shippingAddress.phoneNumber}
                      onChange={handleInputChange}
                      className={formErrors.phoneNumber ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.phoneNumber && <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input 
                      id="addressLine1" 
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleInputChange}
                      className={formErrors.addressLine1 ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.addressLine1 && <p className="text-sm text-red-500">{formErrors.addressLine1}</p>}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input 
                      id="addressLine2" 
                      name="addressLine2"
                      value={shippingAddress.addressLine2 || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className={formErrors.city ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input 
                      id="state" 
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className={formErrors.state ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className={formErrors.zipCode ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.zipCode && <p className="text-sm text-red-500">{formErrors.zipCode}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="Online" id="payment-online" />
                    <Label htmlFor="payment-online" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" /> Online Payment
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="COD" id="payment-cod" />
                    <Label htmlFor="payment-cod">Cash on Delivery</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GPay" id="payment-gpay" />
                    <Label htmlFor="payment-gpay">Google Pay</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea 
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes about your order, e.g., special delivery instructions"
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between py-2 border-b">
                    <div className="flex">
                      <span className="font-medium">
                        {item.quantity} x {item.product.name}
                      </span>
                    </div>
                    <span>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                
                <div className="flex justify-between py-2 border-b">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="flex items-center">
                    <Truck className="mr-2 h-4 w-4" />
                    Shipping
                  </span>
                  <span>
                    {shippingCost === 0 
                      ? 'Free' 
                      : `₹${shippingCost.toLocaleString('en-IN')}`
                    }
                  </span>
                </div>
                
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full mt-6"
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
