
import React from "react";

const PartnersSection = () => {
  return (
    <section id="partners" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">Our Partners</h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
          We collaborate with industry leaders and prestigious institutions to provide you with 
          the best learning experience and opportunities
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* First Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/5be9b869-5cb5-43dc-9e65-26f22222b991.png" 
              alt="180 Degrees Consulting" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/ee025f9b-fedc-4cda-8e5c-1fd2da42c844.png" 
              alt="CA Partnership" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Second Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/9de85f32-0a43-4fd7-bd15-a4dfbea335ff.png" 
              alt="E-Cell IIT Bombay" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/29a68c85-e513-4aed-b23f-545f0936cf9d.png" 
              alt="E-Cell IIT Jodhpur" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/acbf9d29-96f1-4786-a715-0bf59f9da686.png" 
              alt="E-Cell IIT Madras" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/c74b1c9b-d2c0-4c37-b826-062c7b89d4a4.png" 
              alt="E-Cell IIM Kashipur" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/81ce6b1a-aecd-4333-9e17-39be2b91e824.png" 
              alt="E-Cell IIMT" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/6ffae0ae-c0d6-488c-bc10-8edabfa06926.png" 
              alt="Partner Logo" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Third Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/fe9e1950-57f4-4404-b57e-c16cab36946c.png" 
              alt="EDC IIT Delhi" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/82c68210-4775-4851-b6f2-eba6d367725c.png" 
              alt="SpaceCon 2025" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          {/* New Logos */}
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/556dfda0-749a-4206-9ce7-faf227d42f3b.png" 
              alt="Club of Finance" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src="/lovable-uploads/0d1c5006-3de6-4584-a5ee-48fee16f4b82.png" 
              alt="BITS Pilani KK Birla Goa Campus" 
              className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-base sm:text-lg text-gray-600 mb-4">Want to become our partner?</p>
          <button 
            className="text-purple-600 hover:text-purple-700 font-semibold underline transition-colors duration-300 text-sm sm:text-base"
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
