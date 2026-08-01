import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const GUEST_DAILY_LIMIT = 3;
const USER_DAILY_LIMIT = 10;
const GUEST_KEY = "bmm_ai_agent_guest_usage";
const USER_KEY_PREFIX = "bmm_ai_agent_user_usage_";
const MAX_INPUT = 500;

function getUsage(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { date: "", count: 0 };
    const obj = JSON.parse(raw);
    return { date: obj.date || "", count: Number(obj.count) || 0 };
  } catch { return { date: "", count: 0 }; }
}
function bumpUsage(key: string) {
  const today = new Date().toISOString().slice(0, 10);
  const u = getUsage(key);
  const next = u.date === today ? { date: today, count: u.count + 1 } : { date: today, count: 1 };
  localStorage.setItem(key, JSON.stringify(next));
  return next.count;
}
function remaining(key: string, limit: number) {
  const today = new Date().toISOString().slice(0, 10);
  const u = getUsage(key);
  if (u.date !== today) return limit;
  return Math.max(0, limit - u.count);
}

const SUGGESTIONS = [
  "Find product manager jobs in Bangalore",
  "Write 5 resume bullets for a SaaS PM",
  "Recommend a course for a Lean Startup beginner",
  "How do I crack a PM interview?",
];

export default function AIAgentWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm Mentor AI — your career copilot. Ask me to find jobs, generate resume bullets, or recommend a course." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const usageKey = user ? USER_KEY_PREFIX + user.id : GUEST_KEY;
  const dailyLimit = user ? USER_DAILY_LIMIT : GUEST_DAILY_LIMIT;
  const left = remaining(usageKey, dailyLimit);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim().slice(0, MAX_INPUT);
    if (!content || loading) return;
    if (remaining(usageKey, dailyLimit) <= 0) {
      toast({
        title: "Daily limit reached",
        description: user
          ? `You've reached your ${USER_DAILY_LIMIT}/day limit. Please come back tomorrow.`
          : `Guests get ${GUEST_DAILY_LIMIT}/day. Sign up free for ${USER_DAILY_LIMIT}/day.`,
        variant: "destructive",
      });
      return;
    }
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-agent", {
        body: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const reply = (data as any)?.reply || "Sorry, I didn't get that.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      bumpUsage(usageKey);
    } catch (e: any) {
      const msg = String(e?.message || e);
      let friendly = "Something went wrong. Please try again.";
      if (msg.includes("429")) friendly = "AI is busy right now. Please try again in a moment.";
      else if (msg.includes("402")) friendly = "AI credits exhausted. Please try again later.";
      setMessages((m) => [...m, { role: "assistant", content: friendly }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, usageKey, dailyLimit, user]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Mentor AI career assistant"
          aria-expanded={false}
          className="fixed bottom-[calc(1.618rem+env(safe-area-inset-bottom))] left-4 sm:left-6 z-50 group flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark text-primary-foreground shadow-xl px-4 py-3 min-h-[3rem] hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 shrink-0" aria-hidden />
          <span className="hidden sm:inline font-semibold text-sm">Ask Mentor AI</span>
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5">NEW</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Mentor AI career assistant chat"
          className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:left-6 sm:inset-x-auto z-50 w-full sm:w-[380px] max-w-[100vw] h-[85dvh] sm:h-[600px] max-h-[calc(100dvh-2rem)] bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        >
          <header className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <Bot className="w-5 h-5 shrink-0" aria-hidden />
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight truncate">Mentor AI</p>
                <p className="text-[11px] opacity-90 leading-tight truncate">Jobs, courses &amp; career guidance</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close Mentor AI chat"
              className="hover:bg-primary-foreground/20 rounded-md p-2 focus-visible:ring-2 focus-visible:ring-primary-foreground/60 focus-visible:outline-none"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          </header>

          <div
            className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 bg-muted/30"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border border-border text-foreground"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Thinking...
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs bg-background border border-border hover:border-primary hover:text-primary rounded-full px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-border bg-background flex items-end gap-2"
          >
            <label htmlFor="mentor-ai-input" className="sr-only">Ask Mentor AI about jobs, internships or courses</label>
            <Input
              id="mentor-ai-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
              maxLength={MAX_INPUT}
              autoComplete="off"
              placeholder={left > 0 ? `${left} message${left === 1 ? "" : "s"} left today` : "Daily limit reached"}
              disabled={loading || left <= 0}
              className="flex-1 min-w-0"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={loading || left <= 0 || !input.trim()} className="shrink-0">
              <Send className="w-4 h-4" aria-hidden />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
