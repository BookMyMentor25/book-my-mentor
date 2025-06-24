
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Mail, Twitter, Instagram, Youtube } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Team = () => {
  const teamMembers = [
    {
      name: "Najmus Sahar",
      role: "Founder & Lead Mentor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Industry expert with 10+ years in product management and startup mentorship. Passionate about helping students achieve their career goals.",
      skills: ["Product Management", "Lean Startup", "Mentorship"],
      social: {
        linkedin: "#",
        email: "najmus@bookmymentor.com",
        twitter: "#"
      }
    },
    {
      name: "Sarah Johnson",
      role: "Senior Product Mentor",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face",
      bio: "Former Product Manager at leading tech companies. Specializes in SaaS and EdTech product development.",
      skills: ["Product Strategy", "User Research", "Agile"],
      social: {
        linkedin: "#",
        email: "sarah@bookmymentor.com",
        twitter: "#"
      }
    },
    {
      name: "Rajesh Kumar",
      role: "Project Management Lead",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "PMP certified project manager with expertise in IT and healthcare projects. Helps students master project management frameworks.",
      skills: ["Project Management", "Scrum", "PMP"],
      social: {
        linkedin: "#",
        email: "rajesh@bookmymentor.com",
        twitter: "#"
      }
    },
    {
      name: "Priya Sharma",
      role: "Startup Mentor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Serial entrepreneur and startup advisor. Guides aspiring entrepreneurs through the lean startup methodology.",
      skills: ["Entrepreneurship", "Business Strategy", "Fundraising"],
      social: {
        linkedin: "#",
        email: "priya@bookmymentor.com",
        twitter: "#"
      }
    },
    {
      name: "Michael Chen",
      role: "Career Guidance Specialist",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      bio: "HR professional and career coach helping students with placement preparation and interview skills.",
      skills: ["Career Counseling", "Interview Prep", "Resume Building"],
      social: {
        linkedin: "#",
        email: "michael@bookmymentor.com",
        twitter: "#"
      }
    },
    {
      name: "Anita Patel",
      role: "Learning Experience Designer",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
      bio: "Educational technology expert focused on creating engaging learning experiences and curriculum design.",
      skills: ["EdTech", "Curriculum Design", "Learning Analytics"],
      social: {
        linkedin: "#",
        email: "anita@bookmymentor.com",
        twitter: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              Meet Our Team
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Industry experts dedicated to your success
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Our team consists of experienced professionals from leading companies who are passionate about 
              mentoring the next generation of talent.
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center space-x-6 mb-8">
              <a 
                href="https://www.linkedin.com/company/book-my-mentor-co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://www.instagram.com/book_my_mentor/profilecard/?igsh=MXdhMG53anZwY3pmeg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.youtube.com/channel/UCxcoW1rchq3a8--vd-SrS-Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Youtube size={20} />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">{member.name}</CardTitle>
                  <p className="text-purple-600 font-semibold">{member.role}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="bg-purple-100 text-purple-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-4 pt-4">
                    <a
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a
                      href={`mailto:${member.social.email}`}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Mail size={20} />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
