import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Gift, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CODE = "NEWUSER10";
const KEY = "bmm-newuser10-dismissed";

/** Slim, dismissible welcome offer shown only to signed-out visitors. */
const CouponBanner = () => {
  const { user, loading } = useAuth() as { user: unknown; loading?: boolean };
  const [hidden, setHidden] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHidden(sessionStorage.getItem(KEY) === "1");
  }, []);

  if (loading || user || hidden) return null;

  const close = () => {
    sessionStorage.setItem(KEY, "1");
    setHidden(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <aside
      aria-label="New user offer"
      className="relative border-b border-accent/30 bg-gradient-to-r from-accent/10 via-background to-primary/10 animate-fade-in"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-10 py-2.5 text-center text-sm">
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <Gift className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          New here? Get <strong className="text-accent">10% off</strong> your first enrolment
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent bg-background px-3 py-0.5 font-mono text-xs font-bold tracking-wider text-accent transition-colors hover:bg-accent/10"
          aria-label={`Copy coupon code ${CODE}`}
        >
          {CODE}
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <Link
          to="/auth"
          className="rounded-full bg-accent px-3.5 py-1 text-xs font-semibold text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Sign up & save
        </Link>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss offer"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
};

export default CouponBanner;
