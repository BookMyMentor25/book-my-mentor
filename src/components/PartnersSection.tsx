
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const PartnersSection = () => {
  const partners = [
    { src: "/lovable-uploads/ecell-iitkgp.jpg", alt: "E-Cell IIT Kharagpur" },
    { src: "/lovable-uploads/5be9b869-5cb5-43dc-9e65-26f22222b991.png", alt: "180 Degrees Consulting" },
    { src: "/lovable-uploads/ee025f9b-fedc-4cda-8e5c-1fd2da42c844.png", alt: "CA Partnership" },
    { src: "/lovable-uploads/9de85f32-0a43-4fd7-bd15-a4dfbea335ff.png", alt: "E-Cell IIT Bombay" },
    { src: "/lovable-uploads/29a68c85-e513-4aed-b23f-545f0936cf9d.png", alt: "E-Cell IIT Jodhpur" },
    { src: "/lovable-uploads/acbf9d29-96f1-4786-a715-0bf59f9da686.png", alt: "E-Cell IIT Madras" },
    { src: "/lovable-uploads/c74b1c9b-d2c0-4c37-b826-062c7b89d4a4.png", alt: "E-Cell IIM Kashipur" },
    { src: "/lovable-uploads/81ce6b1a-aecd-4333-9e17-39be2b91e824.png", alt: "E-Cell IIMT" },
    { src: "/lovable-uploads/6ffae0ae-c0d6-488c-bc10-8edabfa06926.png", alt: "Partner Logo" },
    { src: "/lovable-uploads/fe9e1950-57f4-4404-b57e-c16cab36946c.png", alt: "EDC IIT Delhi" },
    { src: "/lovable-uploads/82c68210-4775-4851-b6f2-eba6d367725c.png", alt: "SpaceCon 2025" },
    { src: "/lovable-uploads/556dfda0-749a-4206-9ce7-faf227d42f3b.png", alt: "Club of Finance" },
    { src: "/lovable-uploads/0d1c5006-3de6-4584-a5ee-48fee16f4b82.png", alt: "BITS Pilani KK Birla Goa Campus" }
  ];

  return (
    <section id="partners" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Our Partners
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
            We collaborate with industry leaders and prestigious institutions to provide you with 
            the best learning experience and opportunities
          </p>
        </div>
        
        {/* Mobile: Stack layout */}
        <div className="block sm:hidden mb-8">
          <div className="grid grid-cols-2 gap-4">
            {partners.slice(0, 6).map((partner, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-center">
                  <img 
                    src={partner.src} 
                    alt={partner.alt} 
                    className="h-10 w-auto opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          {partners.length > 6 && (
            <p className="text-sm text-gray-500 mt-4">+{partners.length - 6} more partners</p>
          )}
        </div>

        {/* Desktop: Horizontal carousel */}
        <div className="hidden sm:block mb-8 sm:mb-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-white to-gray-50 hover:from-white hover:to-purple-50 relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <CardContent className="p-6 flex items-center justify-center min-h-[120px] relative z-10">
                      <img 
                        src={partner.src} 
                        alt={partner.alt} 
                        className="h-12 lg:h-16 w-auto opacity-75 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 filter group-hover:brightness-110"
                      />
                    </CardContent>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br from-purple-400 via-blue-400 to-emerald-400"></div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-16 bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600" />
            <CarouselNext className="hidden lg:flex -right-16 bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600" />
          </Carousel>
        </div>

        <div className="text-center">
          <p className="text-base sm:text-lg text-gray-600 mb-4">Want to become our partner?</p>
          <button 
            className="relative group text-purple-600 hover:text-purple-700 font-semibold transition-all duration-300 text-sm sm:text-base px-6 py-2 rounded-full border border-purple-200 hover:border-purple-300 hover:bg-purple-50"
            onClick={() => window.location.href = '/contact'}
          >
            <span className="relative z-10">Contact us</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
