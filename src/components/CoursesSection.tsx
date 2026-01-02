
import { useCourses } from "@/hooks/useCourses";
import DynamicCourseCard from "./DynamicCourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoursesSection = () => {
  const { data: courses, isLoading, error } = useCourses();
  const navigate = useNavigate();

  console.log('CoursesSection Debug:', {
    courses: courses?.length || 0,
    isLoading,
    error: error?.message || 'none',
    coursesData: courses
  });

  const BusinessToolkitCard = () => (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 cursor-pointer flex flex-col h-full bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-3 right-3">
        <Badge className="bg-green-500 text-white text-xs px-2 py-1">FREE</Badge>
      </div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Wrench className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          Business Toolkit
          <Sparkles className="h-5 w-5 text-primary" />
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          29 AI-Powered Tools for Product Managers & Entrepreneurs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col relative z-10">
        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>PRD, Project Charter & Scope Documents</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Market Research & Competitor Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Sprint Planning & Agile Tools</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>GTM Strategy & Marketing Planner</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="text-2xl font-bold text-green-600">FREE</div>
          <Button 
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
            onClick={() => navigate('/ai-tools')}
          >
            Explore Tools
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50" id="courses">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Courses & Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our expertly designed courses and free AI-powered business tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50" id="courses">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Courses & Tools</h2>
            <p className="text-red-600">Failed to load courses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50" id="courses">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Courses & Tools</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our expertly designed courses and free AI-powered business tools to accelerate your career growth
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Business Toolkit Card - Featured First */}
          <BusinessToolkitCard />
          
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <DynamicCourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
