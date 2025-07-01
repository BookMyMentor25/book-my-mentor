
import React from "react";

const PartnersSection = () => {
  return (
    <section id="partners" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Partners</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          We collaborate with industry leaders and prestigious institutions to provide you with 
          the best learning experience and opportunities
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* First Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/17cc5ed3-21d0-471a-8197-f89d35fce02b.png" 
              alt="LinkedIn Partner" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/7e1934b2-0701-49e5-93ad-6ab90232c310.png" 
              alt="Gartner Partner" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/99be4bce-11ae-41eb-85bb-166a094c8952.png" 
              alt="Forbes Partner" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/e667d9a3-2aa2-41a8-813a-b41f903788d0.png" 
              alt="Microsoft Partner" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/ea951ada-8288-465a-b807-ce24bddb85fd.png" 
              alt="E-Cell IIT Madras" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Second Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/bf0525bf-37a1-48ef-be98-1823421a283a.png" 
              alt="E-Cell IIT Jodhpur" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/c1e2f504-90d9-4f49-b3dc-e1af5c89ba19.png" 
              alt="Partner 7" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/ea5dd580-c77b-4029-9a09-93bb9eeaec64.png" 
              alt="Partner 8" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/fcc84eb8-4fef-4b4a-8292-66ffe9aab2f7.png" 
              alt="Partner 9" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/e78494d6-eb08-4726-9304-623b36273291.png" 
              alt="Partner 10" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Want to become our partner?</p>
          <button className="text-purple-600 hover:text-purple-700 font-semibold underline transition-colors duration-300">
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
