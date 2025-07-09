
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
      bio: "Visionary leader with 15+ years in product management and business strategy. Former VP at tech unicorns.",
      linkedin: "https://linkedin.com/in/najmusss",
      email: "najmus@buildmymantra.com",
      phone: "+91 98765 43210"
    },
    {
      name: "Akshay Gupta",
      role: "Head of Product",
      image: "/lovable-uploads/e667d9a3-2aa2-41a8-813a-b41f903788d0.png",
      bio: "Product strategist with expertise in AI/ML and user experience design. Led product teams at Fortune 500 companies.",
      linkedin: "https://linkedin.com/in/akshaygupta",
      email: "akshay@buildmymantra.com"
    },
    {
      name: "Gayatri S",
      role: "Head of Engineering",
      image: "/lovable-uploads/4ec15346-1b4c-47ef-a15c-107c30fbfb87.png",
      bio: "Full-stack developer and technical architect with 12+ years of experience in scalable system design.",
      linkedin: "https://linkedin.com/in/gayatris",
      email: "gayatri@buildmymantra.com"
    },
    {
      name: "Rizwan S",
      role: "Lead Data Scientist",
      image: "/lovable-uploads/99be4bce-11ae-41eb-85bb-166a094c8952.png",
      bio: "Data science expert specializing in machine learning and predictive analytics. PhD in Computer Science.",
      linkedin: "https://linkedin.com/in/rizwans",
      email: "rizwan@buildmymantra.com"
    },
    {
      name: "Preeti V",
      role: "Head of Operations",
      image: "/lovable-uploads/b7c3f4ad-5533-4a69-83d1-4b3bc50d0a16.png",
      bio: "Operations excellence leader with expertise in process optimization and team management.",
      linkedin: "https://linkedin.com/in/preetiv",
      email: "preeti@buildmymantra.com"
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
                
                <div className="flex space-x-3">
                  <a href={member.linkedin} className="text-blue-600 hover:text-blue-800">
                    <Linkedin size={20} />
                  </a>
                  <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-gray-800">
                    <Mail size={20} />
                  </a>
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="text-green-600 hover:text-green-800">
                      <Phone size={20} />
                    </a>
                  )}
                </div>
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
