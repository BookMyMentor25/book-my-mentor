import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lock, MessageSquareText, BriefcaseBusiness, Lightbulb, CheckCircle2, Sparkles } from "lucide-react";
import { useCaseStudies, useInterviewQuestions } from "@/hooks/useCourseInsights";

interface Props {
  courseId: string;
  courseTitle: string;
  isSignedIn: boolean;
}

const InterviewPrepSection = ({ courseId, courseTitle, isSignedIn }: Props) => {
  const location = useLocation();
  const { data: questions = [], isLoading: loadingQ } = useInterviewQuestions(courseId, isSignedIn);
  const { data: cases = [], isLoading: loadingC } = useCaseStudies(courseId, isSignedIn);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const authHref = `/auth?redirect=${encodeURIComponent(location.pathname + "#interview-prep")}`;

  return (
    <section id="interview-prep" className="mb-[var(--space-lg)] scroll-mt-24">
      <Card className="shadow-lg overflow-hidden border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15">
              <MessageSquareText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-[1.618rem] font-bold text-foreground leading-tight">
                Interview Questions &amp; Case Studies
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Real hiring-round questions and advanced case studies for {courseTitle}
              </p>
            </div>
            <Badge className="ml-auto bg-accent text-accent-foreground shrink-0">Members only</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-[var(--space-md)] md:p-[var(--space-lg)]">
          {!isSignedIn ? (
            <div className="relative">
              <div aria-hidden className="pointer-events-none select-none space-y-3 blur-[6px] opacity-60">
                {[
                  "Our activation rate fell 11 points in six weeks. How would you find the cause in 48 hours?",
                  "Design pricing for a product used by a team but bought by a CFO.",
                  "Case study: rescuing a roadmap after a 30% mid-year budget cut.",
                ].map((t) => (
                  <div key={t} className="p-4 rounded-lg border border-border bg-secondary/40 text-sm">{t}</div>
                ))}
              </div>
              <div className="mt-6 text-center max-w-xl mx-auto">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Unlock 6 interview questions + 3 case studies — free
                </h3>
                <p className="text-muted-foreground mb-4 text-sm md:text-base">
                  Sign in to access model answer frameworks used in real product, startup and project
                  management interviews. No payment required.
                </p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to={authHref}>
                    <Sparkles className="w-4 h-4 mr-2" /> Sign in to unlock free access
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="interview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-[var(--space-md)]">
                <TabsTrigger value="interview" className="text-xs sm:text-sm">
                  <MessageSquareText className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Interview Questions
                </TabsTrigger>
                <TabsTrigger value="cases" className="text-xs sm:text-sm">
                  <BriefcaseBusiness className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Case Studies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interview">
                {loadingQ ? (
                  <p className="text-muted-foreground text-sm">Loading questions…</p>
                ) : questions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Questions are being added for this course.</p>
                ) : (
                  <div className="space-y-3">
                    {questions.map((q, i) => (
                      <article key={q.id} className="rounded-lg border border-border p-4 hover:border-primary/40 transition-colors">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-[11px]">{q.category}</Badge>
                          <Badge variant="outline" className="text-[11px]">{q.difficulty}</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground leading-snug">
                          Q{i + 1}. {q.question}
                        </h3>
                        {revealed[q.id] ? (
                          <div className="mt-3 p-3 rounded-md bg-secondary/60 border-l-4 border-primary">
                            <p className="text-xs font-semibold text-primary mb-1">Answer framework</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{q.answer_outline}</p>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 px-0 text-primary hover:text-primary"
                            onClick={() => setRevealed((p) => ({ ...p, [q.id]: true }))}
                          >
                            Reveal answer framework
                          </Button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cases">
                {loadingC ? (
                  <p className="text-muted-foreground text-sm">Loading case studies…</p>
                ) : cases.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Case studies are being added for this course.</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {cases.map((cs, i) => (
                      <AccordionItem key={cs.id} value={cs.id} className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="pr-2">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Badge className="bg-accent text-accent-foreground text-[11px]">Case {i + 1}</Badge>
                              <Badge variant="outline" className="text-[11px]">{cs.difficulty}</Badge>
                            </div>
                            <span className="font-semibold text-foreground">{cs.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-4">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Scenario</h4>
                            <p className="text-sm text-foreground/80 leading-relaxed">{cs.scenario}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">The challenge</h4>
                            <p className="text-sm text-foreground/80 leading-relaxed">{cs.challenge}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Your tasks</h4>
                            <ul className="space-y-2">
                              {cs.tasks.map((t) => (
                                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {cs.hint && (
                            <div className="flex items-start gap-2 p-3 rounded-md bg-accent/10 border border-accent/30">
                              <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                              <p className="text-sm text-foreground/80">{cs.hint}</p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default InterviewPrepSection;
