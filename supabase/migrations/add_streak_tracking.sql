-- Streak items table
CREATE TABLE public.streak_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streak completions table
CREATE TABLE public.streak_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  streak_item_id UUID REFERENCES public.streak_items(id) ON DELETE CASCADE NOT NULL,
  completion_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_item_id, completion_date)
);

-- Indexes for better query performance
CREATE INDEX idx_streak_items_user_id ON public.streak_items(user_id);
CREATE INDEX idx_streak_items_active ON public.streak_items(active);
CREATE INDEX idx_streak_completions_user_id ON public.streak_completions(user_id);
CREATE INDEX idx_streak_completions_streak_item_id ON public.streak_completions(streak_item_id);
CREATE INDEX idx_streak_completions_date ON public.streak_completions(completion_date);

-- Enable RLS
ALTER TABLE public.streak_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_completions ENABLE ROW LEVEL SECURITY;

-- Streak items policies
CREATE POLICY "Users can view own streak items"
  ON public.streak_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own streak items"
  ON public.streak_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak items"
  ON public.streak_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own streak items"
  ON public.streak_items FOR DELETE
  USING (auth.uid() = user_id);

-- Streak completions policies
CREATE POLICY "Users can view own streak completions"
  ON public.streak_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own streak completions"
  ON public.streak_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak completions"
  ON public.streak_completions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own streak completions"
  ON public.streak_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_streak_items_updated_at
  BEFORE UPDATE ON public.streak_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
