
-- Create a table for storing user alarms
CREATE TABLE public.user_alarms (
    user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    alarms JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.user_alarms ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own alarms
CREATE POLICY "Users can view their own alarms"
  ON public.user_alarms
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own alarms
CREATE POLICY "Users can insert their own alarms"
  ON public.user_alarms
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own alarms
CREATE POLICY "Users can update their own alarms"
  ON public.user_alarms
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own alarms
CREATE POLICY "Users can delete their own alarms"
  ON public.user_alarms
  FOR DELETE
  USING (auth.uid() = user_id);
