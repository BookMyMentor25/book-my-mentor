-- Add student_count and rating fields to courses table
ALTER TABLE public.courses 
ADD COLUMN student_count INTEGER DEFAULT 0,
ADD COLUMN rating DECIMAL(2,1) DEFAULT 4.9;

-- Update specific courses with the requested student counts and ratings
-- Card 1: Product Management - Regular Plan → 150+ students, rating 4.6
UPDATE public.courses 
SET student_count = 150, rating = 4.6
WHERE title = 'Product Management - Regular Plan';

-- Card 2: Product Management - Advance Plan → 350+ students, keep default rating
UPDATE public.courses 
SET student_count = 350
WHERE title = 'Product Management - Advance Plan';

-- Card 3: Product Management - Premium Plan → 200+ students, rating 4.8
UPDATE public.courses 
SET student_count = 200, rating = 4.8
WHERE title = 'Product Management - Premium Plan';

-- Card 4: Lean Startup → 200+ students, keep default rating
UPDATE public.courses 
SET student_count = 200
WHERE title = 'Lean Startup';

-- Card 5: Project Management → 350+ students, rating 4.7
UPDATE public.courses 
SET student_count = 350, rating = 4.7
WHERE title = 'Project Management';