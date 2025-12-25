
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-skinAura-charcoal text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-primary">Skin</span>Aura
            </h2>
            <p className="text-gray-300 mb-4">
              Your destination for premium skincare products that nourish and rejuvenate.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-white hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-white hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/category/face-serum" className="text-gray-300 hover:text-white transition-colors">Face Serum</Link>
              </li>
              <li>
                <Link to="/category/face-wash" className="text-gray-300 hover:text-white transition-colors">Face Wash</Link>
              </li>
              <li>
                <Link to="/category/sun-screen" className="text-gray-300 hover:text-white transition-colors">Sun Screen</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <a href="mailto:support@skinaura.com" className="text-gray-300 hover:text-white transition-colors">support@skinaura.com</a>
              </li>
              <li>
                <a href="tel:+911234567890" className="text-gray-300 hover:text-white transition-colors">+91 123 456 7890</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SkinAura. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <img src="/placeholder.svg" alt="Payment Method" className="h-6" />
            <img src="/placeholder.svg" alt="Payment Method" className="h-6" />
            <img src="/placeholder.svg" alt="Payment Method" className="h-6" />
            <img src="/placeholder.svg" alt="Payment Method" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
