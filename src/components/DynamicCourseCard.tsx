
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Course, formatPrice } from "@/hooks/useCourses";

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-xl font-bold text-gray-800">{course.title}</CardTitle>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {course.duration && <Badge variant="secondary">{course.duration}</Badge>}
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {formatPrice(course.price)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <h4 className="font-semibold text-gray-800">What You'll Get:</h4>
          <ul className="space-y-2">
            {course.features?.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-600 text-sm">{feature}</span>
              </li>
            )) || []}
          </ul>
        </div>
        <Button 
          onClick={handleEnrollNow}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {user ? 'Enroll Now' : 'Sign In to Enroll'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DynamicCourseCard;
