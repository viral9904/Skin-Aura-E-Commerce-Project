
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'SkinAura',
    siteTagline: 'Premium Skincare Products',
    contactEmail: 'support@skinaura.com',
    contactPhone: '+91 98765 43210',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    enableCOD: true,
    enableOnline: true,
    enableGPay: true,
    enablePhonePe: true,
    enableRazorpay: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newRegistration: true,
  });

  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSiteSettings({
      ...siteSettings,
      [name]: value,
    });
  };

  const handlePaymentToggle = (name: keyof typeof paymentSettings) => {
    setPaymentSettings({
      ...paymentSettings,
      [name]: !paymentSettings[name],
    });
  };

  const handleNotificationToggle = (name: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: !notificationSettings[name],
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your store's general settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={siteSettings.siteName}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="siteTagline">Site Tagline</Label>
                  <Input
                    id="siteTagline"
                    name="siteTagline"
                    value={siteSettings.siteTagline}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    value={siteSettings.contactEmail}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={siteSettings.contactPhone}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                
                <Button onClick={saveSettings}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods for your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cash on Delivery</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to pay on delivery.</p>
                  </div>
                  <Switch
                    checked={paymentSettings.enableCOD}
                    onCheckedChange={() => handlePaymentToggle('enableCOD')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Online Payment</Label>
                    <p className="text-sm text-muted-foreground">Enable online payment methods.</p>
                  </div>
                  <Switch
                    checked={paymentSettings.enableOnline}
                    onCheckedChange={() => handlePaymentToggle('enableOnline')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Pay</Label>
                    <p className="text-sm text-muted-foreground">Allow payments via Google Pay.</p>
                  </div>
                  <Switch
                    checked={paymentSettings.enableGPay}
                    onCheckedChange={() => handlePaymentToggle('enableGPay')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PhonePe</Label>
                    <p className="text-sm text-muted-foreground">Allow payments via PhonePe.</p>
                  </div>
                  <Switch
                    checked={paymentSettings.enablePhonePe}
                    onCheckedChange={() => handlePaymentToggle('enablePhonePe')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Razorpay</Label>
                    <p className="text-sm text-muted-foreground">Allow payments via Razorpay.</p>
                  </div>
                  <Switch
                    checked={paymentSettings.enableRazorpay}
                    onCheckedChange={() => handlePaymentToggle('enableRazorpay')}
                  />
                </div>
                
                <Button onClick={saveSettings}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when notifications are sent.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Confirmation</Label>
                    <p className="text-sm text-muted-foreground">Send notification when an order is placed.</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderConfirmation}
                    onCheckedChange={() => handleNotificationToggle('orderConfirmation')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Shipped</Label>
                    <p className="text-sm text-muted-foreground">Send notification when an order is shipped.</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderShipped}
                    onCheckedChange={() => handleNotificationToggle('orderShipped')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Delivered</Label>
                    <p className="text-sm text-muted-foreground">Send notification when an order is delivered.</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderDelivered}
                    onCheckedChange={() => handleNotificationToggle('orderDelivered')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alert</Label>
                    <p className="text-sm text-muted-foreground">Send notification when product stock is low.</p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStock}
                    onCheckedChange={() => handleNotificationToggle('lowStock')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">Send notification when a new user registers.</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newRegistration}
                    onCheckedChange={() => handleNotificationToggle('newRegistration')}
                  />
                </div>
                
                <Button onClick={saveSettings}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
