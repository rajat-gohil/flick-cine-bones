-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  age integer,
  sex text,
  phone text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create friendships table
CREATE TABLE public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Friendships policies
CREATE POLICY "Users can view their own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friendships"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update rooms table to support friend-based rooms
ALTER TABLE public.rooms 
  ADD COLUMN is_friend_room boolean DEFAULT false,
  ADD COLUMN invited_friends uuid[] DEFAULT '{}';

-- Create streaming_links table for movies
CREATE TABLE public.streaming_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id text NOT NULL,
  platform text NOT NULL,
  url text NOT NULL,
  region text DEFAULT 'IN',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.streaming_links ENABLE ROW LEVEL SECURITY;

-- Anyone can view streaming links
CREATE POLICY "Streaming links are viewable by everyone"
  ON public.streaming_links FOR SELECT
  USING (true);

-- Create custom_genres table
CREATE TABLE public.custom_genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  emoji text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_genres ENABLE ROW LEVEL SECURITY;

-- Anyone can view custom genres
CREATE POLICY "Custom genres are viewable by everyone"
  ON public.custom_genres FOR SELECT
  USING (true);

-- Insert some fun custom genres
INSERT INTO public.custom_genres (name, description, emoji) VALUES
  ('Most likely to be watched by couples', 'Perfect romantic picks for date night', '💑'),
  ('Recommended for teens', 'Age-appropriate entertainment for teenagers', '🎓'),
  ('Comfort food cinema', 'Feel-good movies for cozy nights', '🍿'),
  ('Mind-bending thrillers', 'Movies that will mess with your head', '🤯'),
  ('Guilty pleasures', 'No judgment, just enjoyment', '😏'),
  ('Weekend binge-worthy', 'Perfect for marathon viewing', '📺'),
  ('Rainy day favorites', 'Cozy up when it''s pouring outside', '🌧️'),
  ('Action-packed adrenaline', 'Non-stop thrills and excitement', '💥');