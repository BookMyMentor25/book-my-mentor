
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, BookOpen } from "lucide-react";

const DownloadSection = () => {
  const downloads = [
    {
      title: "Product Management E-book",
      description: "Complete guide to product management principles and best practices",
      icon: <BookOpen className="w-8 h-8" />,
      url: "https://drive.google.com/file/d/1K7-product-management-ebook/view?usp=drive_link",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Lean Startup E-book",
      description: "Master the lean startup methodology to build successful businesses",
      icon: <FileText className="w-8 h-8" />,
      url: "https://drive.google.com/file/d/1L8-lean-startup-ebook/view?usp=drive_link",
      gradient: "from-green-600 to-blue-600"
    },
    {
      title: "Project Management E-book",
      description: "Learn proven project management frameworks and methodologies",
      icon: <Download className="w-8 h-8" />,
      url: "https://drive.google.com/file/d/1M9-project-management-ebook/view?usp=drive_link",
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const brochures = [
    {
      title: "Course Brochure 2024",
      description: "Detailed information about all our courses and mentorship programs",
      url: "https://drive.google.com/file/d/1N0-course-brochure-2024/view?usp=drive_link"
    },
    {
      title: "Placement Report",
      description: "Success stories and placement statistics of our alumni",
      url: "https://drive.google.com/file/d/1O1-placement-report/view?usp=drive_link"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* E-books Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Download E-books</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive guides to accelerate your learning journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {downloads.map((download, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${download.gradient} text-white mb-6`}>
                {download.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{download.title}</h3>
              <p className="text-gray-600 mb-6">{download.description}</p>
              <Button 
                className={`bg-gradient-to-r ${download.gradient} hover:opacity-90 transition-opacity`}
                onClick={() => window.open(download.url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </Button>
            </div>
          ))}
        </div>

        {/* Brochures Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Download Brochures</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get detailed information about our programs and success stories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {brochures.map((brochure, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-600 to-blue-600 text-white mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{brochure.title}</h3>
              <p className="text-gray-600 mb-6">{brochure.description}</p>
              <Button 
                className="bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700"
                onClick={() => window.open(brochure.url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Brochure
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
