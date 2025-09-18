
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import priyaSharmaProfile from "@/assets/priya-sharma-profile.jpg";
import rahulGuptaProfile from "@/assets/rahul-gupta-profile.jpg";
import snehaPatelProfile from "@/assets/sneha-patel-profile.jpg";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Himanshu Raj",
      role: "IIT Guwahati",
      content: "Best and Knowledgeable mentor for one to one guidance and learning. Weekly Live classes are very insightful. Enjoying the course and the live project. Course is helpful and fully recommended.",
      rating: 5,
      image: "/lovable-uploads/himanshu-raj-profile.jpg"
    },
    {
      name: "Dhilip Prasanna",
      role: "EY",
      content: "BookMyMentor is a Great and supportive community where we can learn industry standards knowledge and process in a flexible, convenient manner. The coach Mr.Najmus is a highly skilled, Talented and people friendly person who takes good efforts and care in guiding and coaching. Great team and content in a affordable price. Hats off to their dedication, support and efforts. I will recommend this to everyone who are looking for upskilling in their career.",
      rating: 5,
      image: "/lovable-uploads/dhilip-prasanna-profile.jpg"
    },
    {
      name: "Vishal Singh",
      role: "T.A. Pai Management Institute, Manipal",
      content: "This mentorship program is well designed for aspirants to learn and apply those learnings by doing project. Mentors play a vital role in shaping the entire learning and guiding towards improvement.",
      rating: 5,
      image: "/lovable-uploads/vishal-singh-profile.jpg"
    },
    {
      name: "Priya Sharma",
      role: "Product Manager at TechCorp",
      content: "The Product Management course transformed my career. The mentorship was exceptional and the live projects gave me real-world experience.",
      rating: 5,
      image: priyaSharmaProfile
    },
    {
      name: "Rahul Gupta",
      role: "Startup Founder",
      content: "The Lean Startup program helped me validate my business idea and achieve product-market fit. Highly recommended!",
      rating: 5,
      image: rahulGuptaProfile
    },
    {
      name: "Sneha Patel",
      role: "Project Manager at FinTech Solutions",
      content: "Excellent Project Management course with practical insights. The mock interviews prepared me perfectly for my current role.",
      rating: 5,
      image: snehaPatelProfile
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Students Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real success stories from students who transformed their careers with our mentorship programs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
