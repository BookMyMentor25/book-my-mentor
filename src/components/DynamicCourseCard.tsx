
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Course, formatPrice } from "@/hooks/useCourses";
import { Star, Clock, Award, Users } from "lucide-react";

interface DynamicCourseCardProps {
  course: Course;
}

const DynamicCourseCard = ({ course }: DynamicCourseCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnrollNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const courseTitle = course.title;
    const price = formatPrice(course.price);
    navigate(`/checkout?course=${encodeURIComponent(courseTitle)}&price=${encodeURIComponent(price)}&courseId=${encodeURIComponent(course.id)}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full group relative w-full max-w-md mx-auto">
      {/* Golden ratio card proportions */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">
          BESTSELLER
        </Badge>
      </div>
      
      <CardHeader className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden pb-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 translate-y-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-white/90 text-sm ml-2">(4.9)</span>
            </div>
            <div className="flex items-center space-x-1 text-white/80">
              <Users className="w-4 h-4" />
              <span className="text-sm">2,500+ students</span>
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold mb-3 leading-tight">{course.title}</CardTitle>
          <p className="text-white/90 mb-4 line-clamp-2">{course.description}</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {course.duration && (
              <div className="flex items-center space-x-1 text-white/90">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{course.duration}</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-white/90">
              <Award className="w-4 h-4" />
              <span className="text-sm">Certificate</span>
            </div>
          </div>
          
          {/* Prominent Price Display - Golden Ratio sized */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="text-center">
              <div className="text-white/70 text-sm line-through mb-1">
                ₹{((course.price / 100) * 1.5).toLocaleString('en-IN')}
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatPrice(course.price)}
              </div>
              <div className="text-green-300 text-sm font-semibold">
                33% OFF - Limited Time!
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-6 flex-1">
          <h4 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-2">
            What You'll Master:
          </h4>
          <ul className="space-y-3">
            {course.features?.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start space-x-3 group">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-900 transition-colors">
                  {feature}
                </span>
              </li>
            )) || []}
          </ul>
          
          {course.features && course.features.length > 4 && (
            <div className="text-center">
              <span className="text-blue-600 text-sm font-medium">
                +{course.features.length - 4} more benefits
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">🎯 Success Rate:</span>
              <span className="font-bold text-green-600">95%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">💼 Job Placement:</span>
              <span className="font-bold text-blue-600">85%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate(`/course/${course.id}`)}
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View Course Details
            </Button>
            
            <Button 
              onClick={handleEnrollNow}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {user ? 'Enroll Now - Secure Your Spot!' : 'Sign In to Enroll'}
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            💳 Secure Payment • 📞 24/7 Support
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicCourseCard;
