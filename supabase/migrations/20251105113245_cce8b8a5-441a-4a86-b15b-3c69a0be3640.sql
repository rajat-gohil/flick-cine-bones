-- Create enum for swipe actions
CREATE TYPE swipe_action AS ENUM ('like', 'dislike');

-- Create rooms table for matching sessions
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  genre TEXT,
  user1_id UUID,
  user2_id UUID
);

-- Create swipes table
CREATE TABLE public.swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  movie_id TEXT NOT NULL,
  action swipe_action NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, movie_id)
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Rooms policies
CREATE POLICY "Users can view rooms they're part of"
  ON public.rooms FOR SELECT
  USING (
    user1_id = auth.uid() OR 
    user2_id = auth.uid() OR
    user1_id IS NULL OR
    user2_id IS NULL
  );

CREATE POLICY "Anyone can create a room"
  ON public.rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update rooms they're part of"
  ON public.rooms FOR UPDATE
  USING (
    user1_id = auth.uid() OR 
    user2_id = auth.uid() OR
    user1_id IS NULL OR
    user2_id IS NULL
  );

-- Swipes policies
CREATE POLICY "Users can view swipes in their room"
  ON public.swipes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms
      WHERE rooms.id = swipes.room_id
      AND (rooms.user1_id = auth.uid() OR rooms.user2_id = auth.uid() OR rooms.user1_id IS NULL OR rooms.user2_id IS NULL)
    )
  );

CREATE POLICY "Users can create their own swipes"
  ON public.swipes FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
  );

-- Matches policies
CREATE POLICY "Users can view matches in their room"
  ON public.matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms
      WHERE rooms.id = matches.room_id
      AND (rooms.user1_id = auth.uid() OR rooms.user2_id = auth.uid() OR rooms.user1_id IS NULL OR rooms.user2_id IS NULL)
    )
  );

CREATE POLICY "System can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.swipes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;

-- Function to generate unique room codes
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check for matches
CREATE OR REPLACE FUNCTION check_for_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if both users in the room have liked this movie
  IF NEW.action = 'like' THEN
    IF EXISTS (
      SELECT 1 FROM public.swipes
      WHERE room_id = NEW.room_id
      AND movie_id = NEW.movie_id
      AND action = 'like'
      AND session_id != NEW.session_id
      GROUP BY room_id, movie_id
      HAVING COUNT(DISTINCT session_id) >= 2
    ) THEN
      -- Create a match
      INSERT INTO public.matches (room_id, movie_id)
      VALUES (NEW.room_id, NEW.movie_id)
      ON CONFLICT (room_id, movie_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check for matches after each swipe
CREATE TRIGGER check_match_trigger
AFTER INSERT ON public.swipes
FOR EACH ROW
EXECUTE FUNCTION check_for_match();