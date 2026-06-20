import { useEffect, useRef, useState } from "react";
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

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const key = user ? USER_KEY_PREFIX + user.id : GUEST_KEY;
    const limit = user ? USER_DAILY_LIMIT : GUEST_DAILY_LIMIT;
    if (remaining(key, limit) <= 0) {
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
      bumpUsage(key);
    } catch (e: any) {
      const msg = String(e?.message || e);
      let friendly = "Something went wrong. Please try again.";
      if (msg.includes("429")) friendly = "AI is busy right now. Please try again in a moment.";
      else if (msg.includes("402")) friendly = "AI credits exhausted. Please try again later.";
      setMessages((m) => [...m, { role: "assistant", content: friendly }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Mentor AI assistant"
          className="fixed bottom-24 right-4 z-50 group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl px-4 py-3 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline font-semibold text-sm">Ask Mentor AI</span>
          <span className="absolute -top-1 -right-1 bg-orange-500 text-[10px] font-bold rounded-full px-1.5 py-0.5">NEW</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:inset-x-auto z-50 w-full sm:w-[380px] h-[80vh] sm:h-[600px] bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <div className="font-semibold text-sm leading-tight">Mentor AI</div>
                <div className="text-[11px] opacity-90 leading-tight">Agentic career copilot</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="hover:bg-white/20 rounded p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs bg-background border border-border hover:border-primary rounded-full px-3 py-1.5 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-3 border-t border-border bg-background flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? "Ask anything…" : `${guestRemaining()} free messages left today`}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
