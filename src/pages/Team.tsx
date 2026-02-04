
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Award, Target, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Team = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Najmus SS",
      role: "Founder & CEO",
      image: "/lovable-uploads/Lndn_najmus.jpeg",
      bio: "Entrepreneur | Researcher | Product Management Leader - Visionary Leader with 10+ years in entrepreneurship, product management and business strategy.",
      expertise: ["Product Strategy", "Business Development", "Leadership"]
    },
    {
      name: "Akshay Gupta",
      role: "Head of Digital Marketing",
      image: "/lovable-uploads/05229b88-fb60-457c-a09f-105a72185c57.png",
      bio: "Product strategist with vast digital marketing UI/UX experience. Led teams at Fortune 500 companies.",
      expertise: ["Digital Marketing", "UI/UX Design", "Growth Strategy"]
    },
    {
      name: "Gayatri S",
      role: "Head of Engineering and Project Management",
      image: "/lovable-uploads/4ec15346-1b4c-47ef-a15c-107c30fbfb87.png",
      bio: "Full-stack developer and Author with 10+ years of experience in scalable system design and Project Management.",
      expertise: ["Software Engineering", "Project Management", "System Design"]
    },
    {
      name: "Rizwan S",
      role: "Lead Data Scientist",
      image: "/lovable-uploads/42b0341b-80b0-43f8-87d1-0d9a29f59242.png",
      bio: "Data science expert specializing in machine learning and predictive analytics.",
      expertise: ["Machine Learning", "Data Analytics", "AI Solutions"]
    },
    {
      name: "Preeti N",
      role: "Head of Operations",
      image: "/lovable-uploads/b7c3f4ad-5533-4a69-83d1-4b3bc50d0a16.png",
      bio: "Operations excellence leader with expertise in process optimization and team management.",
      expertise: ["Operations", "Team Management", "Process Optimization"]
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Students Mentored" },
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Target, value: "95%", label: "Success Rate" },
    { icon: Lightbulb, value: "50+", label: "Corporate Trainings" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Meet Our Expert Team | Product Management & Career Mentors - Book My Mentor"
        description="Meet our expert team of Product Management, Lean Startup, and Project Management mentors with 10+ years of industry experience. Get personalized career guidance from IIT & IIM alumni."
        keywords="product management mentors, career mentors India, PM coaches, startup advisors, business strategy experts, IIT alumni mentors, project management trainers"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-secondary transition-colors"
          aria-label="Back to Home"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Button>

        {/* Hero Section - 5-Second Clarity */}
        <header className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            <span>Industry Experts & Mentors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
            Meet Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Expert Team</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our diverse team of <strong>Product Management</strong>, <strong>Lean Startup</strong>, and <strong>Project Management</strong> experts 
            brings together decades of experience to help you succeed in your career.
          </p>
        </header>

        {/* Stats Section - Golden Ratio Proportions */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16" aria-label="Team achievements">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
              <p className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Team Grid - 60-30-10 Color System */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" aria-label="Team members">
          {teamMembers.map((member, index) => (
            <article 
              key={index} 
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-500"
            >
              {/* Image Container - Golden Ratio Height */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img 
                  src={member.image} 
                  alt={`${member.name} - ${member.role} at Book My Mentor`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h2>
                <p className="text-primary font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{member.bio}</p>
                
                {/* Expertise Tags - 10% Accent Color */}
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* CTA Section - Conversion Optimized */}
        <section className="mt-16 lg:mt-20 text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 lg:p-12 border border-border">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Ready to Learn from the Best?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our mentorship programs and get personalized guidance from industry experts 
            with proven track records in Product Management and Business Strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              onClick={() => navigate('/#courses')}
            >
              Explore Courses
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
