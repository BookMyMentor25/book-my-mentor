
import React from "react";

const PartnersSection = () => {
  const scrollToContact = () => {
    const footer = document.querySelector('footer');
    footer?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="partners" className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Trusted Partners</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/17cc5ed3-21d0-471a-8197-f89d35fce02b.png" 
              alt="LinkedIn Partner" 
              className="h-12 md:h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/7e1934b2-0701-49e5-93ad-6ab90232c310.png" 
              alt="Gartner Partner" 
              className="h-12 md:h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/99be4bce-11ae-41eb-85bb-166a094c8952.png" 
              alt="Forbes Partner" 
              className="h-12 md:h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/e667d9a3-2aa2-41a8-813a-b41f903788d0.png" 
              alt="Microsoft Partner" 
              className="h-12 md:h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Want to become our partner?</h3>
          <p className="text-lg mb-6">Join our network of industry leaders and help shape the future of professional development.</p>
          <button 
            onClick={scrollToContact}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
