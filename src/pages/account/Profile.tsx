import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { User, MapPin, Plus, Check, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Address } from '@/types/user';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Address state
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState<Address>({
    id: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    isDefault: false
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Load addresses from local storage
  useEffect(() => {
    if (user) {
      const savedAddresses = localStorage.getItem(`skinAuraAddresses_${user.id}`);
      if (savedAddresses) {
        try {
          setAddresses(JSON.parse(savedAddresses));
        } catch (error) {
          console.error('Failed to parse saved addresses:', error);
        }
      }
    }
  }, [user]);

  // Save addresses to local storage whenever they change
  useEffect(() => {
    if (user && addresses.length > 0) {
      localStorage.setItem(`skinAuraAddresses_${user.id}`, JSON.stringify(addresses));
      // Also update the user object with the addresses
      updateUserProfile({ addresses: addresses as any });
    }
  }, [addresses, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUserProfile({ name: formData.name });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real app, we would call an API endpoint to update the password
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSaveAddress = () => {
    // Form validation
    if (!addressFormData.fullName || !addressFormData.addressLine1 || !addressFormData.city || 
        !addressFormData.state || !addressFormData.zipCode || !addressFormData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(addressFormData.phoneNumber.replace(/\s+/g, ''))) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    // Zip code validation
    if (!/^\d{6}$/.test(addressFormData.zipCode.replace(/\s+/g, ''))) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit ZIP code",
        variant: "destructive",
      });
      return;
    }

    if (editingAddressId) {
      // Update existing address
      setAddresses(addresses.map(address => 
        address.id === editingAddressId ? 
          { ...addressFormData } : 
          addressFormData.isDefault ? { ...address, isDefault: false } : address
      ));
    } else {
      // Add new address
      const newAddress: Address = {
        ...addressFormData,
        id: `addr_${Date.now()}`,
        // If this is the first address or isDefault is true, set as default
        isDefault: addressFormData.isDefault || addresses.length === 0
      };
      
      // If setting this address as default, unset default on others
      if (newAddress.isDefault) {
        setAddresses(addresses.map(addr => ({...addr, isDefault: false})));
        setAddresses(prev => [...prev, newAddress]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
    }

    setIsAddressDialogOpen(false);
    resetAddressForm();
    
    toast({
      title: editingAddressId ? "Address Updated" : "Address Added",
      description: `Your address has been ${editingAddressId ? 'updated' : 'added'} successfully.`,
    });
  };

  const handleEditAddress = (address: Address) => {
    setAddressFormData(address);
    setEditingAddressId(address.id);
    setIsAddressDialogOpen(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter(address => address.id !== addressId));
    toast({
      title: "Address Deleted",
      description: "Your address has been removed successfully.",
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === addressId
    })));
    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated successfully.",
    });
  };

  const resetAddressForm = () => {
    setAddressFormData({
      id: '',
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      isDefault: false
    });
    setEditingAddressId(null);
  };

  const handleAddNewAddress = () => {
    resetAddressForm();
    setIsAddressDialogOpen(true);
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">Email cannot be changed.</p>
                </div>
              </div>
              
              <Button type="submit">Update Profile</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to maintain security.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <Button type="submit">Change Password</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Shipping Addresses</CardTitle>
              <CardDescription>Manage your shipping addresses.</CardDescription>
            </div>
            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNewAddress} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingAddressId ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                  <DialogDescription>
                    {editingAddressId ? 'Update your shipping address details.' : 'Add a new shipping address to your account.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={addressFormData.fullName}
                      onChange={handleAddressInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={addressFormData.phoneNumber}
                      onChange={handleAddressInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={addressFormData.addressLine1}
                      onChange={handleAddressInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={addressFormData.addressLine2 || ''}
                      onChange={handleAddressInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={addressFormData.city}
                        onChange={handleAddressInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={addressFormData.state}
                        onChange={handleAddressInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={addressFormData.zipCode}
                      onChange={handleAddressInputChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="isDefault"
                      name="isDefault"
                      type="checkbox"
                      className="h-4 w-4 text-primary"
                      checked={addressFormData.isDefault || false}
                      onChange={(e) => setAddressFormData({...addressFormData, isDefault: e.target.checked})}
                    />
                    <Label htmlFor="isDefault" className="text-sm font-normal">
                      Set as default address
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveAddress}>Save Address</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="mx-auto h-8 w-8 mb-2" />
                <p>No addresses saved yet.</p>
                <p className="text-sm">Add a shipping address to speed up your checkout.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <Card key={address.id} className={`overflow-hidden ${address.isDefault ? 'border-primary' : ''}`}>
                    <div className="bg-muted p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="font-medium">{address.fullName}</span>
                      </div>
                      {address.isDefault && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-1 text-sm">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} - {address.zipCode}</p>
                      <p>Phone: {address.phoneNumber}</p>
                      
                      <div className="pt-3 flex justify-end space-x-2">
                        {!address.isDefault && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditAddress(address)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-200 text-red-500 hover:bg-red-50" 
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
