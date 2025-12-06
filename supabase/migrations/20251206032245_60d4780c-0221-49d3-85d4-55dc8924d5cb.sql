-- Add sample quiz questions for each quiz
INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'What is the primary goal of Product Management?',
  '[{"id": "a", "text": "Writing code for products"}, {"id": "b", "text": "Identifying customer needs and delivering value"}, {"id": "c", "text": "Managing team schedules"}, {"id": "d", "text": "Designing user interfaces"}]'::jsonb,
  'b',
  1,
  1
FROM public.quizzes q
WHERE q.title LIKE '%Product Management%'
LIMIT 1;

INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'What does MVP stand for in product development?',
  '[{"id": "a", "text": "Most Valuable Player"}, {"id": "b", "text": "Minimum Viable Product"}, {"id": "c", "text": "Maximum Value Proposition"}, {"id": "d", "text": "Market Value Priority"}]'::jsonb,
  'b',
  1,
  2
FROM public.quizzes q
WHERE q.title LIKE '%Product Management%'
LIMIT 1;

INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'Which framework is commonly used in Agile product development?',
  '[{"id": "a", "text": "Waterfall"}, {"id": "b", "text": "Six Sigma"}, {"id": "c", "text": "Scrum"}, {"id": "d", "text": "ITIL"}]'::jsonb,
  'c',
  1,
  3
FROM public.quizzes q
WHERE q.title LIKE '%Product Management%'
LIMIT 1;

INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'What is a Business Model Canvas (BMC)?',
  '[{"id": "a", "text": "A painting technique"}, {"id": "b", "text": "A strategic management tool for developing business models"}, {"id": "c", "text": "A coding framework"}, {"id": "d", "text": "A financial report"}]'::jsonb,
  'b',
  1,
  4
FROM public.quizzes q
WHERE q.title LIKE '%Product Management%'
LIMIT 1;

INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'What is the Build-Measure-Learn loop used for?',
  '[{"id": "a", "text": "Building software applications"}, {"id": "b", "text": "Validating business hypotheses through rapid experimentation"}, {"id": "c", "text": "Measuring employee performance"}, {"id": "d", "text": "Learning programming languages"}]'::jsonb,
  'b',
  1,
  5
FROM public.quizzes q
WHERE q.title LIKE '%Lean Startup%'
LIMIT 1;

-- Add questions to all quizzes that don't have questions yet
INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'What is the purpose of market sizing (TAM, SAM, SOM)?',
  '[{"id": "a", "text": "To determine office space"}, {"id": "b", "text": "To estimate potential revenue opportunity"}, {"id": "c", "text": "To count competitors"}, {"id": "d", "text": "To measure product dimensions"}]'::jsonb,
  'b',
  1,
  1
FROM public.quizzes q
WHERE NOT EXISTS (SELECT 1 FROM public.quiz_questions qq WHERE qq.quiz_id = q.id);

INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'What is a Value Proposition?',
  '[{"id": "a", "text": "A company''s stock price"}, {"id": "b", "text": "A promise of value to be delivered to customers"}, {"id": "c", "text": "An employee benefit package"}, {"id": "d", "text": "A marketing budget"}]'::jsonb,
  'b',
  1,
  2
FROM public.quizzes q
WHERE (SELECT COUNT(*) FROM public.quiz_questions qq WHERE qq.quiz_id = q.id) < 2;

INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_id, points, order_index)
SELECT 
  q.id,
  'What is Risk Management in project management?',
  '[{"id": "a", "text": "Taking dangerous actions"}, {"id": "b", "text": "Identifying, assessing, and mitigating potential risks"}, {"id": "c", "text": "Avoiding all decisions"}, {"id": "d", "text": "Insurance policies only"}]'::jsonb,
  'b',
  1,
  3
FROM public.quizzes q
WHERE (SELECT COUNT(*) FROM public.quiz_questions qq WHERE qq.quiz_id = q.id) < 3;