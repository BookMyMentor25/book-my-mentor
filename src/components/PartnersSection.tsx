
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
              src="/lovable-uploads/5be9b869-5cb5-43dc-9e65-26f22222b991.png" 
              alt="180 Degrees Consulting" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Second Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/ee025f9b-fedc-4cda-8e5c-1fd2da42c844.png" 
              alt="CA Partnership" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/9de85f32-0a43-4fd7-bd15-a4dfbea335ff.png" 
              alt="E-Cell IIT Bombay" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/29a68c85-e513-4aed-b23f-545f0936cf9d.png" 
              alt="E-Cell IIT Jodhpur" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/acbf9d29-96f1-4786-a715-0bf59f9da686.png" 
              alt="E-Cell IIT Madras" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/c74b1c9b-d2c0-4c37-b826-062c7b89d4a4.png" 
              alt="E-Cell IIM Kashipur" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Third Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/81ce6b1a-aecd-4333-9e17-39be2b91e824.png" 
              alt="E-Cell IIMT" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/6ffae0ae-c0d6-488c-bc10-8edabfa06926.png" 
              alt="Partner Logo" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/fe9e1950-57f4-4404-b57e-c16cab36946c.png" 
              alt="EDC IIT Delhi" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/82c68210-4775-4851-b6f2-eba6d367725c.png" 
              alt="SpaceCon 2025" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Want to become our partner?</p>
          <button 
            className="text-purple-600 hover:text-purple-700 font-semibold underline transition-colors duration-300"
            onClick={() => window.location.href = '/contact'}
          >
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
