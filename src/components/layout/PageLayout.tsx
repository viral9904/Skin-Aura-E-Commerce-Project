
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  // Get current location to check if we're on the order confirmation view
  const location = useLocation();
  const pathname = location.pathname;
  
  // Check if the current page is the checkout confirmation page
  // We'll use a URL pattern that matches the pattern used in the Checkout component
  // when showing the order confirmation page
  const isOrderConfirmationPage = pathname === '/checkout' && location.search.includes('confirmed=true');

  return (
    <div className="flex flex-col min-h-screen">
      {!isOrderConfirmationPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isOrderConfirmationPage && <Footer />}
    </div>
  );
};

export default PageLayout;
