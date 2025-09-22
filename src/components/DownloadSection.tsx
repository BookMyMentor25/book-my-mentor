
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, BookOpen, FolderOpen, Star, Eye, ArrowRight, Sparkles, Users, Clock, TrendingUp } from "lucide-react";

const DownloadSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [downloadCounts, setDownloadCounts] = useState([1247, 1892, 2341, 756]);
  const sectionRef = useRef<HTMLElement>(null);

  const downloads = [
    {
      title: "Product Management E-book",
      description: "Complete guide to product management principles and best practices",
      icon: BookOpen,
      url: "https://drive.google.com/drive/folders/11juHSihiYHaecF97yo-uawNkVnAwytLm?usp=sharing",
      gradient: "from-blue-600 to-purple-600",
      shadowColor: "shadow-blue-500/25",
      pages: "127 pages",
      rating: 4.9,
      category: "Management",
      preview: [
        "Introduction to Product Management",
        "Market Research & Analysis", 
        "Product Strategy & Roadmapping",
        "User Experience Design",
        "Data-Driven Decision Making"
      ]
    },
    {
      title: "Lean Startup E-book",
      description: "Master the lean startup methodology to build successful businesses",
      icon: TrendingUp,
      url: "https://drive.google.com/drive/folders/1ynFvQeVjcm2IzDh39JogVRv2OyH8zzMh?usp=sharing",
      gradient: "from-green-600 to-blue-600",
      shadowColor: "shadow-green-500/25",
      pages: "98 pages",
      rating: 4.8,
      category: "Entrepreneurship",
      preview: [
        "Build-Measure-Learn Framework",
        "MVP Development Strategies",
        "Customer Validation Techniques",
        "Pivot vs Persevere",
        "Scaling Successful Features"
      ]
    },
    {
      title: "Project Management E-book",
      description: "Learn proven project management frameworks and methodologies",
      icon: Users,
      url: "https://drive.google.com/drive/folders/12FEayGzOKAFNZfzJtPDUx0Q3KNzsQVH_?usp=sharing",
      gradient: "from-purple-600 to-pink-600",
      shadowColor: "shadow-purple-500/25",
      pages: "156 pages",
      rating: 4.9,
      category: "Management",
      preview: [
        "Agile & Scrum Methodologies",
        "Risk Management Strategies",
        "Team Leadership & Communication",
        "Project Planning & Execution",
        "Quality Assurance & Testing"
      ]
    },
    {
      title: "Course Brochures",
      description: "Access our comprehensive course brochures and program details",
      icon: FolderOpen,
      url: "https://drive.google.com/drive/folders/1cch0XTeB7RcBQH8IhXCsoQ-qPZCQol3I?usp=sharing",
      gradient: "from-orange-600 to-red-600",
      shadowColor: "shadow-orange-500/25",
      pages: "Multiple files",
      rating: 4.7,
      category: "Resources",
      preview: [
        "Course Curriculum Details",
        "Instructor Profiles",
        "Certification Information",
        "Pricing & Packages",
        "Student Success Stories"
      ]
    }
  ];

  const handleDownload = (url: string, index: number) => {
    // Simulate download count increment
    setDownloadCounts(prev => {
      const newCounts = [...prev];
      newCounts[index] += 1;
      return newCounts;
    });
    
    window.open(url, '_blank');
  };

  return (
    <section 
      ref={sectionRef} 
      id="downloads" 
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/20 shadow-lg">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">Free Learning Resources</span>
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Download E-books
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Access our comprehensive guides to accelerate your learning journey with industry-proven strategies
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-12 mb-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Free Access</div>
            </div>
          </div>
        </div>
        
        {/* E-books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {downloads.map((download, index) => {
            const IconComponent = download.icon;
            
            return (
              <Card 
                key={index} 
                className={`
                  group relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl 
                  transition-all duration-700 hover:scale-105 overflow-hidden
                  ${hoveredCard === index ? download.shadowColor + ' shadow-2xl' : ''}
                `}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${download.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <CardContent className="p-6 sm:p-8 relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`
                      inline-flex items-center justify-center w-14 h-14 rounded-2xl 
                      bg-gradient-to-r ${download.gradient} text-white shadow-lg
                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                    `}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{download.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${download.gradient} text-white font-medium`}>
                        {download.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {download.pages}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {download.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {download.description}
                    </p>
                  </div>

                  {/* Preview content - only show on hover */}
                  <div className={`
                    transition-all duration-500 overflow-hidden
                    ${hoveredCard === index ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        What's Inside:
                      </h4>
                      <ul className="space-y-1">
                        {download.preview.slice(0, 3).map((item, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                            <ArrowRight className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Download stats */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {downloadCounts[index].toLocaleString()} downloads
                    </span>
                    <span>Updated recently</span>
                  </div>

                  {/* Download button */}
                  <Button 
                    className={`
                      w-full bg-gradient-to-r ${download.gradient} 
                      hover:scale-105 hover:shadow-lg transition-all duration-300
                      text-white font-semibold py-3 rounded-xl relative overflow-hidden
                      group-hover:animate-pulse
                    `}
                    onClick={() => handleDownload(download.url, index)}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Free
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 sm:p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Level Up Your Skills?
              </h3>
              
              <p className="text-lg sm:text-xl opacity-90 mb-8">
                Join thousands of learners who've transformed their careers with our expert guidance
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Personal Mentorship
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300"
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore All Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
