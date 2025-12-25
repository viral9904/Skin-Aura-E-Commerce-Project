
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="container max-w-7xl py-10">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="py-4 flex flex-col items-center mb-2">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-3">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-semibold text-lg">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <Button
                variant={isActive('/account') ? 'default' : 'ghost'}
                className="justify-start"
                asChild
              >
                <Link to="/account">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </Button>
              
              <Button
                variant={isActive('/account/orders') ? 'default' : 'ghost'}
                className="justify-start"
                asChild
              >
                <Link to="/account/orders">
                  <Package className="mr-2 h-4 w-4" /> Orders
                </Link>
              </Button>
              
              <Button
                variant={isActive('/wishlist') ? 'default' : 'ghost'}
                className="justify-start"
                asChild
              >
                <Link to="/wishlist">
                  <Heart className="mr-2 h-4 w-4" /> Wishlist
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
