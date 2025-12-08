-- Create table to track Business Toolkit usage
CREATE TABLE public.toolkit_usage (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    tool_name TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.toolkit_usage ENABLE ROW LEVEL SECURITY;

-- Users can insert their own usage records
CREATE POLICY "Users can insert their own usage"
ON public.toolkit_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own usage
CREATE POLICY "Users can view their own usage"
ON public.toolkit_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Admin can view all usage
CREATE POLICY "Admin can view all usage"
ON public.toolkit_usage
FOR SELECT
USING (is_admin(auth.uid()));

-- Create index for faster queries
CREATE INDEX idx_toolkit_usage_user_id ON public.toolkit_usage(user_id);
CREATE INDEX idx_toolkit_usage_created_at ON public.toolkit_usage(created_at DESC);