
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Quote, TrendingUp, Award, Users } from "lucide-react";
import priyaSharmaProfile from "@/assets/priya-sharma-profile.jpg";
import rahulGuptaProfile from "@/assets/rahul-gupta-profile.jpg";
import snehaPatelProfile from "@/assets/sneha-patel-profile.jpg";

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: "Himanshu Raj",
      role: "IIT Guwahati",
      content: "Best and Knowledgeable mentor for one to one guidance and learning. Weekly Live classes are very insightful. Enjoying the course and the live project. Course is helpful and fully recommended.",
      rating: 5,
      image: "/lovable-uploads/himanshu-raj-profile.jpg",
      achievement: "95% Placement Success"
    },
    {
      name: "Dhilip Prasanna",
      role: "EY",
      content: "BookMyMentor is a Great and supportive community where we can learn industry standards knowledge and process in a flexible, convenient manner. The coach Mr.Najmus is a highly skilled, Talented and people friendly person who takes good efforts and care in guiding and coaching. Great team and content in a affordable price. Hats off to their dedication, support and efforts. I will recommend this to everyone who are looking for upskilling in their career.",
      rating: 5,
      image: "/lovable-uploads/dhilip-prasanna-profile.jpg",
      achievement: "Career Growth 200%"
    },
    {
      name: "Vishal Singh",
      role: "T.A. Pai Management Institute, Manipal",
      content: "This mentorship program is well designed for aspirants to learn and apply those learnings by doing project. Mentors play a vital role in shaping the entire learning and guiding towards improvement.",
      rating: 5,
      image: "/lovable-uploads/vishal-singh-profile.jpg",
      achievement: "Project Success Rate 98%"
    },
    {
      name: "Priya Sharma",
      role: "Product Manager at TechCorp",
      content: "The Product Management course transformed my career. The mentorship was exceptional and the live projects gave me real-world experience.",
      rating: 5,
      image: priyaSharmaProfile,
      achievement: "Salary Increase 150%"
    },
    {
      name: "Rahul Gupta",
      role: "Startup Founder",
      content: "The Lean Startup program helped me validate my business idea and achieve product-market fit. Highly recommended!",
      rating: 5,
      image: rahulGuptaProfile,
      achievement: "Raised $500K Funding"
    },
    {
      name: "Sneha Patel",
      role: "Project Manager at FinTech Solutions",
      content: "Excellent Project Management course with practical insights. The mock interviews prepared me perfectly for my current role.",
      rating: 5,
      image: snehaPatelProfile,
      achievement: "Team Performance +80%"
    }
  ];

  const stats = [
    { icon: Users, value: "2000+", label: "Happy Students" },
    { icon: Award, value: "98%", label: "Success Rate" },
    { icon: TrendingUp, value: "150%", label: "Avg Salary Increase" }
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Student Success Stories</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
              What Our Students Say
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Real success stories from students who transformed their careers with our mentorship programs
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-6 sm:gap-12 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Card Stack */}
        <div className="block sm:hidden mb-8">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`
                  absolute w-full transition-all duration-700 transform
                  ${index === currentSlide 
                    ? 'translate-x-0 opacity-100 z-10 scale-100' 
                    : index < currentSlide 
                      ? '-translate-x-full opacity-0 z-0 scale-95'
                      : 'translate-x-full opacity-0 z-0 scale-95'
                  }
                  bg-white/90 backdrop-blur-sm border-0 shadow-xl
                `}
                style={{ top: `${index * 2}px` }}
              >
                <CardContent className="p-6">
                  <div className="absolute top-4 right-4">
                    <Quote className="w-8 h-8 text-purple-200" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">"{testimonial.content}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full mr-4 object-cover border-3 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-purple-600">{testimonial.achievement}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Card placeholder for spacing */}
            <div className="h-80 opacity-0"></div>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-purple-600 w-8' : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal Carousel */}
        <div className="hidden sm:block">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group h-full bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)] group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <CardContent className="p-8 relative z-10 h-full flex flex-col">
                      <div className="absolute top-4 right-4">
                        <Quote className="w-10 h-10 text-purple-200 group-hover:text-purple-300 transition-colors duration-300" />
                      </div>
                      
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 mb-6 text-base leading-relaxed flex-grow group-hover:text-gray-800 transition-colors duration-300">
                        "{testimonial.content}"
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full mr-4 object-cover border-3 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform duration-300"></div>
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-gray-900 group-hover:text-purple-800 transition-colors duration-300">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-100 group-hover:border-purple-200 transition-colors duration-300">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700">{testimonial.achievement}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-16 bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600" />
            <CarouselNext className="hidden lg:flex -right-16 bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600" />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Your Success Story?</h3>
              <p className="text-lg mb-6 opacity-90">Join thousands of students who transformed their careers</p>
              <button 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 hover:scale-105 transform shadow-lg"
                onClick={() => window.location.href = '/contact'}
              >
                Start Your Journey Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
