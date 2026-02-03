import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Course, formatPrice } from "@/hooks/useCourses";
import { Star, Clock, Award, Users, ArrowRight, Target, CheckCircle } from "lucide-react";

interface DynamicCourseCardProps {
  course: Course;
}

// SEO-optimized course metadata
const courseMetadata: Record<string, { bestFor: string; keywords: string[] }> = {
  'product management foundations program': {
    bestFor: 'Students & Freshers',
    keywords: ['product management', 'PM fundamentals', 'beginner PM course']
  },
  'product manager career accelerator': {
    bestFor: 'Competition Participants',
    keywords: ['PM career', 'product manager job', 'PM interview prep']
  },
  'product manager mentorship & hiring program': {
    bestFor: 'Career Switchers',
    keywords: ['PM mentorship', 'product manager placement', 'PM hiring']
  },
  'lean startup & business strategy program': {
    bestFor: 'Founders & Entrepreneurs',
    keywords: ['lean startup', 'business strategy', 'startup validation']
  },
  'project management for tech & startup roles': {
    bestFor: 'Aspiring Project Managers',
    keywords: ['project management', 'agile', 'tech project manager']
  }
};

const DynamicCourseCard = ({ course }: DynamicCourseCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use backend data directly
  const successRate = course.success_rate || 95;
  const jobPlacement = course.job_placement || 85;
  
  // Get metadata for this course
  const metadata = courseMetadata[course.title.toLowerCase()];

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
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col w-full max-w-md mx-auto border-2 border-transparent hover:border-primary/20 bg-card">
      {/* Bestseller Badge - 10% accent color */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-accent text-accent-foreground font-bold shadow-lg">
          BESTSELLER
        </Badge>
      </div>
      
      {/* Header Section - 60% primary gradient */}
      <CardHeader className="bg-gradient-to-br from-primary via-primary/90 to-primary-dark text-primary-foreground relative overflow-hidden pb-6">
        {/* Decorative golden ratio circles */}
        <div className="absolute top-0 right-0 w-[38.2%] h-[38.2%] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[23.6%] h-[23.6%] bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          {/* Rating & Students - Trust Indicators */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
              <span className="text-primary-foreground/90 text-sm ml-2 font-medium">
                {course.rating || 4.9}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-primary-foreground/80">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{course.student_count || 0}+</span>
            </div>
          </div>
          
          {/* Course Title - SEO H2 */}
          <CardTitle className="text-xl md:text-2xl font-bold mb-2 leading-tight">
            {course.title}
          </CardTitle>
          
          {/* Best For Badge */}
          {metadata?.bestFor && (
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-sm text-primary-foreground/90 font-medium">
                Best for: {metadata.bestFor}
              </span>
            </div>
          )}
          
          {/* Course Meta */}
          <div className="flex flex-wrap gap-3 mb-4">
            {course.duration && (
              <div className="flex items-center gap-1.5 text-primary-foreground/80">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{course.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-primary-foreground/80">
              <Award className="w-4 h-4" />
              <span className="text-sm">Certificate</span>
            </div>
          </div>
          
          {/* Price Display - Golden Ratio Box */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-primary-foreground/60 text-sm line-through">
                  ₹{((course.price / 100) * 1.5).toLocaleString('en-IN')}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {formatPrice(course.price)}
                </div>
              </div>
              <Badge className="bg-accent/90 text-accent-foreground font-bold px-3 py-1.5">
                33% OFF
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Content Section - 30% neutral */}
      <CardContent className="p-6 flex-1 flex flex-col bg-gradient-to-b from-card to-secondary/20">
        {/* Features List */}
        <div className="space-y-4 flex-1">
          <h4 className="font-bold text-foreground text-base border-b border-border pb-2">
            What You'll Master:
          </h4>
          <ul className="space-y-2.5">
            {course.features?.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start gap-2.5 group/item">
                <div className="p-0.5 bg-primary/10 rounded-full mt-0.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm leading-relaxed group-hover/item:text-foreground transition-colors">
                  {feature}
                </span>
              </li>
            )) || []}
          </ul>
          
          {course.features && course.features.length > 4 && (
            <p className="text-sm text-primary font-medium">
              +{course.features.length - 4} more benefits
            </p>
          )}
        </div>
        
        {/* Success Metrics */}
        <div className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-xl border border-primary/10">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Success Rate
            </span>
            <span className="font-bold text-primary">{successRate}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              Job Placement
            </span>
            <span className="font-bold text-accent">{jobPlacement}%</span>
          </div>
        </div>
        
        {/* CTA Buttons - 3-Click Navigation */}
        <div className="mt-6 space-y-3">
          <Button 
            onClick={() => navigate(`/course/${course.id}`)}
            variant="outline"
            className="w-full h-11 text-sm font-semibold border-2 border-primary text-primary hover:bg-primary/5 group/btn"
          >
            View Course Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            onClick={handleEnrollNow}
            className="w-full h-12 text-base font-bold cta-primary transform transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            {user ? 'Enroll Now' : 'Sign In to Enroll'}
          </Button>
        </div>
        
        {/* Trust Signals */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Secure Payment • 24/7 Support
        </p>
      </CardContent>
    </Card>
  );
};

export default DynamicCourseCard;
