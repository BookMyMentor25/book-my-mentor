-- Add success_rate and job_placement columns to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS success_rate INTEGER,
ADD COLUMN IF NOT EXISTS job_placement INTEGER;

-- Update existing courses with the variable success rates and job placements
UPDATE courses 
SET success_rate = 95, job_placement = 85 
WHERE id = 'a991cf65-a9fb-4e11-b9d0-4c28c98bf1af';

UPDATE courses 
SET success_rate = 96, job_placement = 87 
WHERE id = '7331cd2f-8d0a-4226-81e7-25ddd50e8cbd';

UPDATE courses 
SET success_rate = 97, job_placement = 88 
WHERE id = '6b43cc09-8e4f-4612-8761-c043c903c671';

UPDATE courses 
SET success_rate = 96, job_placement = 86 
WHERE id = '97dd9dd1-64f7-4008-a2cf-4384f8327e9e';

UPDATE courses 
SET success_rate = 96, job_placement = 86 
WHERE id = 'ccf8b2b7-d2b9-4c33-9f3a-49543f43e7ee';