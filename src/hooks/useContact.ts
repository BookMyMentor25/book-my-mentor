import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  course_interest?: string;
  /** Anti-bot: hidden honeypot field, must stay empty */
  honeypot?: string;
  /** Anti-bot: ms the user spent on the form before submitting */
  elapsedMs?: number;
  /** Anti-bot: answer to the human verification question */
  humanAnswer?: string;
  /** Anti-bot: expected answer */
  humanExpected?: number;
}

const RATE_LIMIT_KEY = 'bmm-inquiry-timestamps';
const MAX_PER_WINDOW = 2;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MIN_FILL_MS = 4000; // humans take at least a few seconds

const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'sharklasers.com',
  'tempmail.com', 'temp-mail.org', 'trashmail.com', '10minutemail.com',
  'dispostable.com', 'getnada.com', 'maildrop.cc', 'fakeinbox.com',
  'throwawaymail.com', 'moakt.com', 'emailondeck.com', 'mintemail.com',
];

const SPAM_KEYWORDS = [
  'seo service', 'backlink', 'crypto', 'bitcoin', 'forex', 'casino', 'viagra',
  'loan offer', 'work from home guarantee', 'buy followers', 'telegram.me',
  'investment opportunity', 'click here to earn', 'porn', 'escort',
];

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Please enter your full name.' })
    .max(80, { message: 'Name must be under 80 characters.' })
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, { message: 'Name can only contain letters, spaces, apostrophes and hyphens.' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address.' })
    .max(160, { message: 'Email must be under 160 characters.' }),
  phone: z
    .string()
    .trim()
    .max(20, { message: 'Phone number is too long.' })
    .regex(/^[+]?[0-9\s()-]{7,20}$/, { message: 'Please enter a valid phone number.' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(20, { message: 'Please describe your requirement in at least 20 characters.' })
    .max(1000, { message: 'Message must be under 1000 characters.' }),
  course_interest: z.string().trim().max(60).optional().or(z.literal('')),
});

/** Heuristics that catch bot / spam submissions. Returns a reason, or null when clean. */
const detectSpam = (data: ContactFormData): string | null => {
  const message = (data.message || '').toLowerCase();
  const name = (data.name || '').trim();
  const email = (data.email || '').trim().toLowerCase();

  // Hidden field filled in => automated bot
  if (data.honeypot && data.honeypot.trim() !== '') return 'bot';

  // Submitted impossibly fast
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < MIN_FILL_MS) {
    return 'Please take a moment to review your message before sending.';
  }

  // Human verification question
  if (typeof data.humanExpected === 'number') {
    if (Number(data.humanAnswer) !== data.humanExpected) {
      return 'Incorrect answer to the verification question. Please try again.';
    }
  }

  // Links are the #1 spam signal for an education inquiry form
  const urlMatches = message.match(/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|xyz|top|info|biz|io)\b)/gi);
  if (urlMatches && urlMatches.length > 0) {
    return 'Links are not allowed in the message. Please describe your requirement in plain text.';
  }

  // Disposable email domains
  const domain = email.split('@')[1] || '';
  if (DISPOSABLE_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) {
    return 'Please use a valid personal or work email address.';
  }

  // Known spam keywords
  if (SPAM_KEYWORDS.some((k) => message.includes(k))) {
    return 'Your message looks like promotional content and was not sent.';
  }

  // Random-string names / messages (no vowels, or mostly non-letters)
  const looksRandom = (value: string) => {
    const letters = value.replace(/[^A-Za-z]/g, '');
    if (letters.length < 6) return false;
    const vowels = (letters.match(/[aeiouAEIOU]/g) || []).length;
    const caseSwitches = (value.match(/[a-z][A-Z]/g) || []).length;
    return vowels / letters.length < 0.15 || caseSwitches > 4;
  };
  if (looksRandom(name) || looksRandom(data.message || '')) {
    return 'Your message could not be verified as genuine. Please write it in plain language.';
  }

  // Same character repeated, or no spaces at all in a long message
  if (/(.)\1{6,}/.test(message)) return 'Your message looks invalid. Please rewrite it.';
  if (message.length > 40 && !message.includes(' ')) {
    return 'Your message looks invalid. Please rewrite it.';
  }

  return null;
};

const checkRateLimit = (): boolean => {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const stamps: number[] = raw ? JSON.parse(raw) : [];
    const recent = stamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) return false;
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
    return true;
  } catch {
    return true;
  }
};

export const useContact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitInquiry = async (formData: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // 1. Schema validation
      const parsed = contactSchema.safeParse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        course_interest: formData.course_interest,
      });

      if (!parsed.success) {
        const firstError = parsed.error.errors[0]?.message || 'Please check the form and try again.';
        toast({ title: 'Invalid details', description: firstError, variant: 'destructive' });
        return { success: false as const, error: firstError };
      }

      // 2. Bot / spam heuristics
      const spamReason = detectSpam({ ...formData, ...parsed.data });
      if (spamReason) {
        if (spamReason === 'bot') {
          // Silently drop bot submissions — never reveal the trap
          toast({
            title: 'Message sent successfully!',
            description: "We'll get back to you within 24 hours.",
          });
          return { success: true as const };
        }
        toast({ title: 'Message not sent', description: spamReason, variant: 'destructive' });
        return { success: false as const, error: spamReason };
      }

      // 3. Rate limiting
      if (!checkRateLimit()) {
        const msg = 'You have already sent us a message recently. Please email info@bookmymentor.com instead.';
        toast({ title: 'Too many requests', description: msg, variant: 'destructive' });
        return { success: false as const, error: msg };
      }

      const clean = parsed.data;

      const { error } = await supabase.from('inquiries').insert({
        name: clean.name,
        email: clean.email.toLowerCase(),
        phone: clean.phone || null,
        message: clean.message,
        course_interest: clean.course_interest || null,
        status: 'new',
      });

      if (error) throw error;

      // Notification emails (non-blocking)
      try {
        const { error: notificationError } = await supabase.functions.invoke('send-inquiry-notification', {
          body: {
            name: clean.name,
            email: clean.email.toLowerCase(),
            phone: clean.phone,
            message: clean.message,
            course_interest: clean.course_interest,
          },
        });
        if (notificationError) console.error('Error sending notification emails:', notificationError);
      } catch (emailError) {
        console.error('Error invoking notification function:', emailError);
      }

      toast({
        title: 'Message sent successfully!',
        description: "We'll get back to you within 24 hours. Check your email for confirmation.",
      });

      return { success: true as const };
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return { success: false as const, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitInquiry,
    isSubmitting,
  };
};
