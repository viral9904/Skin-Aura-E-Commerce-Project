
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CategoryCard {
  title: string;
  description: string;
  image: string;
  link: string;
}

const categories: CategoryCard[] = [
  {
    title: 'Face Serum',
    description: 'Targeted treatments to address specific skin concerns.',
    image: '/placeholder.svg',
    link: '/category/face-serum',
  },
  {
    title: 'Face Wash',
    description: 'Gentle cleansers for all skin types.',
    image: '/placeholder.svg',
    link: '/category/face-wash',
  },
  {
    title: 'Sun Screen',
    description: 'Protection against harmful UV rays.',
    image: '/placeholder.svg',
    link: '/category/sun-screen',
  },
];

const CategoryHighlight = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our curated collection of premium skincare products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button asChild>
                  <Link to={category.link}>Explore {category.title}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlight;
