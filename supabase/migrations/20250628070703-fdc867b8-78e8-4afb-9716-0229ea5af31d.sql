
-- Remove the sample courses that were inserted
DELETE FROM public.courses 
WHERE title IN (
  'Product Management Masterclass',
  'Lean Startup Methodology', 
  'Project Management Professional'
);
