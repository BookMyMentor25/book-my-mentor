
import { Card, CardContent } from "@/components/ui/card";

const PartnersSection = () => {
  const partners = [
    {
      name: "180 Degrees Consulting",
      logo: "/lovable-uploads/7e1934b2-0701-49e5-93ad-6ab90232c310.png",
    },
    {
      name: "CA Training", 
      logo: "/lovable-uploads/b7c3f4ad-5533-4a69-83d1-4b3bc50d0a16.png",
    },
    {
      name: "E-Cell IIT Bombay",
      logo: "/lovable-uploads/aa112f11-643e-4b67-9a93-974fcb1475f6.png",
    },
    {
      name: "E-Cell IIT Jodhpur",
      logo: "/lovable-uploads/094264e8-61c4-48a8-a96b-6b78477b5858.png",
    },
    {
      name: "E-Cell IIT Madras",
      logo: "/lovable-uploads/a4d64569-ea01-4a58-9f74-c6fbe55e2dac.png",
    },
    {
      name: "E-Cell IIM Kashipur",
      logo: "/lovable-uploads/fcc84eb8-4fef-4b4a-8292-66ffe9aab2f7.png",
    },
    {
      name: "E-Cell IIMT",
      logo: "/lovable-uploads/c1e2f504-90d9-4f49-b3dc-e1af5c89ba19.png",
    },
    {
      name: "Partner 8",
      logo: "/lovable-uploads/ea5dd580-c77b-4029-9a09-93bb9eeaec64.png",
    },
    {
      name: "eDC IIT Delhi",
      logo: "/lovable-uploads/e78494d6-eb08-4726-9304-623b36273291.png",
    },
    {
      name: "SpaceCon 2025",
      logo: "/lovable-uploads/99be4bce-11ae-41eb-85bb-166a094c8952.png",
    },
  ];

  return (
    <section id="partners" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Partners</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We collaborate with industry leaders and prestigious institutions to provide you with the best learning experience and opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
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
