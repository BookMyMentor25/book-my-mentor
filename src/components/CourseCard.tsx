
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  sessions: string;
  features: string[];
  plans: {
    name: string;
    price: string;
    duration: string;
    projects: string;
  }[];
}

const CourseCard = ({ title, description, duration, sessions, features, plans }: CourseCardProps) => {
  const handlePlanSelect = (plan: { name: string; price: string; duration: string; projects: string }) => {
    const courseTitle = `${title} - ${plan.name}`;
    window.location.href = `/checkout?course=${encodeURIComponent(courseTitle)}&price=${encodeURIComponent(plan.price)}`;
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
          <p className="text-gray-600 mt-2">{description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">{duration}</Badge>
            <Badge variant="secondary">{sessions}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">What You'll Get:</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
            {index === 1 && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div>Duration: {plan.duration}</div>
                <div>Live Projects: {plan.projects === "Multiple Live Projects" ? "1 Live Project" : plan.projects}</div>
              </div>
              <Button 
                onClick={() => handlePlanSelect(plan)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseCard;
