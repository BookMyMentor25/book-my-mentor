
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, TrendingUp, CheckCircle } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "To empower students, entrepreneurs and working professionals with the skills and experience necessary to excel in the competitive job market."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personalized Mentorship",
      description: "One-on-one guidance from industry experts tailored to your specific needs and career goals."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Practical Experience",
      description: "Live projects, internships, and real-world applications to bridge the gap between theory and practice."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Career Support",
      description: "Comprehensive placement assistance and certification to boost your professional profile."
    }
  ];

  const skills = [
    "Product Management",
    "Data Science & Analytics",
    "Digital Marketing",
    "Project Management",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design"
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main About Content */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About Book My Mentor
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Book My Mentor is designed to bridge the gap between academic learning and industry requirements 
            by offering a comprehensive suite of services, including live project work, internship opportunities, 
            1:1 mentorship sessions, certificates, and placement assistance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Us Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-red-600 mr-3">⚠️</span>
                Why us?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Students often experience panic and anxiety when their peers secure job placements, 
                prompting a last-minute scramble for experience and skills. Similarly, employees 
                facing potential layoffs seek to upgrade their skill sets.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-green-600 mr-3">💡</span>
                How we solve?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Book My Mentor addresses these challenges through personalized mentorship from 
                industry experts, practical experience via live projects, internships, placement 
                assistance, and certification.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trending Skills Section */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Trending Skills</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Step into the Future with Book My Mentor - Where Skills Recommended by LinkedIn, Gartner, and Forbes Become Yours.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-md transition-shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
