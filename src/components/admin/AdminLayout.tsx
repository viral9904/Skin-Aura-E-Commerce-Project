
import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Users, ShoppingBag, Settings, BarChart, Package2 } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";

const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <BarChart className="h-4 w-4" />,
      exact: true,
    },
    {
      title: "Products",
      path: "/admin/products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Categories",
      path: "/admin/categories",
      icon: <Package2 className="h-4 w-4" />,
    },
    {
      title: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Reports",
      path: "/admin/reports",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b border-border p-4">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                <span className="text-primary">SkinAura</span> Admin
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path, item.exact)}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground">
              <p>Admin Panel v1.0</p>
              <p>© 2025 SkinAura All rights reserved</p>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="h-16 border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="font-semibold text-lg">Admin Dashboard</h1>
            </div>
            <div>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
