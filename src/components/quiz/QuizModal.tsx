import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Quiz, QuizQuestion, QuizAttempt, useSubmitQuiz } from '@/hooks/useQuiz';
import { toast } from 'sonner';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz;
  questions: QuizQuestion[];
  attempt: QuizAttempt;
}

const QuizModal = ({ open, onOpenChange, quiz, questions, attempt }: QuizModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<{ score: number; total: number; passed: boolean } | null>(null);

  const submitQuiz = useSubmitQuiz();

  const handleSubmit = useCallback(async () => {
    if (isSubmitted) return;
    
    const answerResults = questions.map(q => ({
      question_id: q.id,
      selected_option_id: answers[q.id] || '',
      is_correct: answers[q.id] === q.correct_option_id,
    }));

    const score = answerResults.filter(a => a.is_correct).reduce((sum, a) => {
      const q = questions.find(q => q.id === a.question_id);
      return sum + (q?.points || 0);
    }, 0);

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= quiz.passing_score;

    try {
      await submitQuiz.mutateAsync({
        attemptId: attempt.id,
        answers: answerResults,
        score,
        totalPoints,
        passed,
      });

      setResults({ score, total: totalPoints, passed });
      setIsSubmitted(true);
      toast.success(passed ? 'Congratulations! You passed!' : 'Quiz completed. Keep practicing!');
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  }, [answers, attempt.id, isSubmitted, questions, quiz.passing_score, submitQuiz]);

  useEffect(() => {
    if (!open || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  if (isSubmitted && results) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {results.passed ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-orange-600" />
              )}
              Quiz Results
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className={`text-center p-6 rounded-lg ${results.passed ? 'bg-green-50' : 'bg-orange-50'}`}>
              <p className="text-4xl font-bold mb-2">
                {Math.round((results.score / results.total) * 100)}%
              </p>
              <p className="text-lg">
                Score: {results.score} / {results.total}
              </p>
              <Badge className={`mt-2 ${results.passed ? 'bg-green-600' : 'bg-orange-600'}`}>
                {results.passed ? 'PASSED' : 'NOT PASSED'}
              </Badge>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correct_option_id;
                return (
                  <div key={q.id} className={`p-3 rounded border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <p className="font-medium text-sm">Q{idx + 1}: {q.question_text}</p>
                    <p className="text-xs mt-1">
                      Your answer: {q.options.find(o => o.id === userAnswer)?.text || 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-green-600 mt-1">
                        Correct: {q.options.find(o => o.id === q.correct_option_id)?.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{quiz.title}</DialogTitle>
            <Badge variant={timeLeft < 60 ? 'destructive' : 'secondary'} className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Object.keys(answers).length} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {timeLeft < 60 && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Less than a minute remaining!
            </div>
          )}

          <div className="min-h-[200px]">
            <h3 className="text-lg font-semibold mb-4">{currentQuestion?.question_text}</h3>
            <div className="space-y-3">
              {currentQuestion?.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            
            {currentIndex === questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={submitQuiz.isPending}>
                {submitQuiz.isPending ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}>
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
