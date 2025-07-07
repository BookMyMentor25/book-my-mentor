
import { useCourses } from "@/hooks/useCourses";
import DynamicCourseCard from "./DynamicCourseCard";
import { Skeleton } from "@/components/ui/skeleton";

const CoursesSection = () => {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50" id="courses">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our expertly designed courses to accelerate your career growth
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Courses</h2>
            <p className="text-red-600">Failed to load courses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 f-pattern-layout" id="courses">
      <div className="rwd-container">
        <div className="text-center mb-16">
          <h2 className="responsive-text-3xl font-bold text-gray-800 mb-4 hierarchy-primary">Our Courses</h2>
          <p className="responsive-text-xl text-gray-600 max-w-3xl mx-auto hierarchy-secondary">
            Choose from our expertly designed courses to accelerate your career growth
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12 content-primary">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="w-full h-full">
                <DynamicCourseCard course={course} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 hierarchy-tertiary">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
