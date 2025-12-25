

import FeaturedProducts from '@/components/product/FeaturedProducts';
import BestSellingProducts from '@/components/product/BestSellingProducts';
import CategoryHighlight from '@/components/product/CategoryHighlight';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-skinAura-lavender to-skinAura-pink py-16 md:py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in">
                Radiant Skin,<br />Naturally Yours
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-lg animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
                Discover premium skincare products that reveal your skin's natural beauty with effective, science-backed formulations.
              </p>
              <div className="space-x-4 animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
                <Button size="lg" asChild>
                  <Link to="/products">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in opacity-0" style={{ animationDelay: '0.9s' }}>
              <img 
                src="/placeholder.svg" 
                alt="SkinAura Products" 
                className="mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryHighlight />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Best Selling Products */}
      <BestSellingProducts />

      {/* Testimonials Section */}
      <section className="py-16 bg-skinAura-cream/50">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover why thousands of customers trust SkinAura for their skincare needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img 
                    src="/placeholder.svg" 
                    alt={`Customer ${index}`} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold">Customer Name</h4>
                    <div className="text-yellow-500">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Skincare Routine?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of satisfied customers who have discovered the SkinAura difference.
          </p>
          <Button size="lg" variant="secondary" className="px-8" asChild>
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
