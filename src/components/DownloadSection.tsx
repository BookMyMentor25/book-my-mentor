
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, BookOpen, FolderOpen } from "lucide-react";

const DownloadSection = () => {
  const downloads = [
    {
      title: "Product Management E-book",
      description: "Complete guide to product management principles and best practices",
      icon: <BookOpen className="w-6 sm:w-8 h-6 sm:h-8" />,
      url: "https://drive.google.com/drive/folders/11juHSihiYHaecF97yo-uawNkVnAwytLm?usp=sharing",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Lean Startup E-book",
      description: "Master the lean startup methodology to build successful businesses",
      icon: <FileText className="w-6 sm:w-8 h-6 sm:h-8" />,
      url: "https://drive.google.com/drive/folders/1ynFvQeVjcm2IzDh39JogVRv2OyH8zzMh?usp=sharing",
      gradient: "from-green-600 to-blue-600"
    },
    {
      title: "Project Management E-book",
      description: "Learn proven project management frameworks and methodologies",
      icon: <Download className="w-6 sm:w-8 h-6 sm:h-8" />,
      url: "https://drive.google.com/drive/folders/12FEayGzOKAFNZfzJtPDUx0Q3KNzsQVH_?usp=sharing",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: "Brochures",
      description: "Access our comprehensive course brochures and program details",
      icon: <FolderOpen className="w-6 sm:w-8 h-6 sm:h-8" />,
      url: "https://drive.google.com/drive/folders/1cch0XTeB7RcBQH8IhXCsoQ-qPZCQol3I?usp=sharing",
      gradient: "from-orange-600 to-red-600"
    }
  ];

  return (
    <section id="downloads" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Download E-books</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Access our comprehensive guides to accelerate your learning journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {downloads.map((download, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 sm:p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className={`inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-r ${download.gradient} text-white mb-4 sm:mb-6`}>
                {download.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{download.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{download.description}</p>
              <Button 
                className={`bg-gradient-to-r ${download.gradient} hover:opacity-90 transition-opacity text-sm sm:text-base`}
                onClick={() => window.open(download.url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
