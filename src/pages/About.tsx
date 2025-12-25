


const About = () => {
  return (
   
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About SkinAura</h1>
          
          <div className="mb-12">
            <img 
              src="/placeholder.svg" 
              alt="SkinAura Team" 
              className="rounded-lg w-full h-64 object-cover mb-6"
            />
            
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              SkinAura was founded in 2020 with a simple mission: to create effective, science-backed skincare products that are accessible to everyone. Our journey began when our founder, struggling with sensitive skin, couldn't find products that were both gentle and effective.
            </p>
            <p className="text-gray-600 mb-6">
              After years of research and collaboration with dermatologists, we developed our first line of products focused on nourishing and protecting the skin's natural barrier. Today, we continue to innovate, bringing you premium skincare solutions that deliver real results.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Philosophy</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-skinAura-lavender/20 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Science-Backed</h3>
                <p className="text-gray-600">
                  All our formulations are based on proven scientific research and extensively tested for efficacy.
                </p>
              </div>
              <div className="bg-skinAura-pink/20 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Clean Ingredients</h3>
                <p className="text-gray-600">
                  We carefully select ingredients that are safe, effective, and free from harmful chemicals.
                </p>
              </div>
              <div className="bg-skinAura-green/20 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Sustainable Practices</h3>
                <p className="text-gray-600">
                  From eco-friendly packaging to ethical sourcing, we strive to minimize our environmental footprint.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-gray-600 mb-6">
              At SkinAura, we believe that great skincare should be a part of everyone's daily routine. We're committed to creating products that not only work but also feel luxurious to use. Our team continually researches the latest developments in skincare science to bring you the most effective formulations.
            </p>
            <p className="text-gray-600">
              We stand behind every product we sell with a satisfaction guarantee. If you're not completely satisfied with any purchase, we'll work with you to make it right.
            </p>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              SkinAura is powered by a passionate team of skincare enthusiasts, dermatologists, and beauty experts dedicated to helping you achieve your skin goals.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3">
                    <img 
                      src="/placeholder.svg" 
                      alt={`Team Member ${index}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">Team Member</h3>
                  <p className="text-sm text-gray-500">Position</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default About;
