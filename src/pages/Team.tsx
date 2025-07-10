
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Team = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Najmus SS",
      role: "Founder & CEO",
      image: "/lovable-uploads/17cc5ed3-21d0-471a-8197-f89d35fce02b.png",
      bio: "Entrepreneur | Researcher | Product Management Leader - Visionary Leader with 10+ years in entrepreneurship, product management and business strategy."
    },
    {
      name: "Akshay Gupta",
      role: "Head of Digital Marketing",
      image: "/lovable-uploads/05229b88-fb60-457c-a09f-105a72185c57.png",
      bio: "Product strategist with vast digital marketing UI/UX experience. Led teams at Fortune 500 companies."
    },
    {
      name: "Gayatri S",
      role: "Head of Engineering and Project Management",
      image: "/lovable-uploads/4ec15346-1b4c-47ef-a15c-107c30fbfb87.png",
      bio: "Full-stack developer and Author with 10+ years of experience in scalable system design and Project Management."
    },
    {
      name: "Rizwan S",
      role: "Lead Data Scientist",
      image: "/lovable-uploads/42b0341b-80b0-43f8-87d1-0d9a29f59242.png",
      bio: "Data science expert specializing in machine learning and predictive analytics."
    },
    {
      name: "Preeti N",
      role: "Head of Operations",
      image: "/lovable-uploads/b7c3f4ad-5533-4a69-83d1-4b3bc50d0a16.png",
      bio: "Operations excellence leader with expertise in process optimization and team management."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-purple-100 transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Meet Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our diverse team of experts brings together decades of experience in product management, 
            technology, and business strategy to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                
                {(member as any).phone && (
                  <div className="flex space-x-3">
                    <a href={`tel:${(member as any).phone}`} className="text-green-600 hover:text-green-800">
                      <Phone size={20} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;
