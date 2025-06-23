
import { Card, CardContent } from "@/components/ui/card";

const PartnersSection = () => {
  // Placeholder partner logos - you can replace these with actual partner logos
  const partners = [
    {
      name: "Partner 1",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Partner 2", 
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Partner 3",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Partner 4",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Partner 5",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center",
    },
    {
      name: "Partner 6",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center",
    },
  ];

  return (
    <section id="partners" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Partners</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We collaborate with industry leaders to provide you with the best learning experience and opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600">
            Want to become our partner? 
            <a href="#contact" className="text-purple-600 hover:text-purple-800 font-semibold ml-2">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
