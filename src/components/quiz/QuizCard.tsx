import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Award, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Quiz, QuizAttempt } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';

interface QuizCardProps {
  quiz: Quiz;
  attempts: QuizAttempt[];
  onStartQuiz: () => void;
}

const QuizCard = ({ quiz, attempts, onStartQuiz }: QuizCardProps) => {
  const { user } = useAuth();
  
  const completedAttempts = attempts.filter(a => a.completed_at);
  const bestAttempt = completedAttempts.reduce<QuizAttempt | null>((best, current) => {
    if (!best || (current.score || 0) > (best.score || 0)) return current;
    return best;
  }, null);

  // Allow all users to take the quiz - no authentication required
  const handleStartQuiz = () => {
    onStartQuiz();
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-2 border-primary/20 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            Free Assessment Quiz
          </CardTitle>
          <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1">
            ✨ FREE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-[var(--space-md)] p-[var(--space-lg)]">
        <div>
          <h3 className="font-bold text-foreground text-lg">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-[var(--space-md)] text-sm">
          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            <span>{quiz.time_limit_minutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <Award className="h-4 w-4 text-accent" />
            <span>Pass: {quiz.passing_score}%</span>
          </div>
        </div>

        {/* Show best attempt only if user is logged in and has attempts */}
        {user && bestAttempt && (
          <div className={`p-[var(--space-md)] rounded-xl ${bestAttempt.passed ? 'bg-primary/10 border-2 border-primary/30' : 'bg-accent/10 border-2 border-accent/30'}`}>
            <div className="flex items-center gap-3">
              {bestAttempt.passed ? (
                <div className="p-2 bg-primary/20 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <div className="p-2 bg-accent/20 rounded-full">
                  <XCircle className="h-5 w-5 text-accent" />
                </div>
              )}
              <div>
                <p className={`font-bold ${bestAttempt.passed ? 'text-primary' : 'text-accent'}`}>
                  Best Score: {bestAttempt.score}/{bestAttempt.total_points} ({Math.round((bestAttempt.score || 0) / (bestAttempt.total_points || 1) * 100)}%)
                </p>
                <p className="text-xs text-muted-foreground">
                  {completedAttempts.length} attempt(s) completed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info for non-logged in users */}
        {!user && (
          <div className="p-[var(--space-md)] rounded-xl bg-secondary/30 border border-primary/10">
            <p className="text-sm text-muted-foreground text-center">
              💡 <strong>Take this free quiz</strong> to test your knowledge! Sign in to save your progress.
            </p>
          </div>
        )}

        <Button 
          onClick={handleStartQuiz} 
          className="w-full h-12 font-bold cta-secondary rounded-xl text-base"
        >
          {user 
            ? (completedAttempts.length > 0 ? '🔄 Retake Quiz' : '🚀 Start Quiz') 
            : '🎯 Take Free Quiz'
          }
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          No credit card required • Instant results
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
