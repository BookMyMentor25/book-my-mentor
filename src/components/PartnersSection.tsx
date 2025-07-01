
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
              src="/lovable-uploads/adb05625-8590-4f24-8232-15aee356e561.png" 
              alt="180 Degrees Consulting" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Second Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/cc42969d-6751-4647-a629-aec7947cfad4.png" 
              alt="CA Partnership" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/d590a072-502c-4a9c-8f77-badea76c7ac9.png" 
              alt="E-Cell IIT Bombay" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/a01dce07-d1e4-49f4-8227-aa0dfcb5f971.png" 
              alt="E-Cell IIT Jodhpur" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/567531a1-2b0b-47f4-bc91-c5fb8afee48a.png" 
              alt="E-Cell IIT Madras" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/0da05d60-444c-4ce8-80d7-d372fbe51610.png" 
              alt="E-Cell IIM Kashipur" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Third Row */}
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/c5b42e34-0f16-4daa-a332-89e1b78af936.png" 
              alt="E-Cell IIMT" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/92dfb824-91d0-41b5-b008-99d196bffc31.png" 
              alt="Partner Logo" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/0db8843f-e5bf-4fa7-a036-7d9f463ddc5d.png" 
              alt="EDC IIT Delhi" 
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src="/lovable-uploads/0aa6a962-a6b0-4c98-89ba-d6dc7435d312.png" 
              alt="SpaceCon 2025" 
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
