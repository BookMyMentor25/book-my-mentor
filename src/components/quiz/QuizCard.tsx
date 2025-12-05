import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Award, CheckCircle, XCircle } from 'lucide-react';
import { Quiz, QuizAttempt } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface QuizCardProps {
  quiz: Quiz;
  attempts: QuizAttempt[];
  onStartQuiz: () => void;
}

const QuizCard = ({ quiz, attempts, onStartQuiz }: QuizCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const completedAttempts = attempts.filter(a => a.completed_at);
  const bestAttempt = completedAttempts.reduce<QuizAttempt | null>((best, current) => {
    if (!best || (current.score || 0) > (best.score || 0)) return current;
    return best;
  }, null);

  const handleStartQuiz = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    onStartQuiz();
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Free Assessment Quiz
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            FREE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{quiz.time_limit_minutes} minutes</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>Pass: {quiz.passing_score}%</span>
          </div>
        </div>

        {bestAttempt && (
          <div className={`p-3 rounded-lg ${bestAttempt.passed ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-center gap-2">
              {bestAttempt.passed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-orange-600" />
              )}
              <div>
                <p className={`font-medium ${bestAttempt.passed ? 'text-green-700' : 'text-orange-700'}`}>
                  Best Score: {bestAttempt.score}/{bestAttempt.total_points} ({Math.round((bestAttempt.score || 0) / (bestAttempt.total_points || 1) * 100)}%)
                </p>
                <p className="text-xs text-muted-foreground">
                  {completedAttempts.length} attempt(s) completed
                </p>
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleStartQuiz} className="w-full">
          {!user ? 'Sign In to Take Quiz' : completedAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
