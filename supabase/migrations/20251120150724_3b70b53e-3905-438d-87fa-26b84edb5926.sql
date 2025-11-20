-- Fix 1: Restrict profiles table access to authenticated users and friends only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own and friends' profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR EXISTS (
    SELECT 1 FROM public.friendships 
    WHERE (
      (user_id = auth.uid() AND friend_id = profiles.id AND status = 'accepted')
      OR 
      (friend_id = auth.uid() AND user_id = profiles.id AND status = 'accepted')
    )
  )
);

-- Fix 2: Remove anonymous access from rooms table
DROP POLICY IF EXISTS "Users can view rooms they're part of" ON public.rooms;
DROP POLICY IF EXISTS "Users can update rooms they're part of" ON public.rooms;
DROP POLICY IF EXISTS "Anyone can create a room" ON public.rooms;

CREATE POLICY "Authenticated users view their rooms"
ON public.rooms
FOR SELECT
USING (
  (user1_id = auth.uid()) OR (user2_id = auth.uid())
);

CREATE POLICY "Authenticated users update their rooms"
ON public.rooms
FOR UPDATE
USING (
  (user1_id = auth.uid()) OR (user2_id = auth.uid())
);

CREATE POLICY "Authenticated users create rooms"
ON public.rooms
FOR INSERT
WITH CHECK (
  auth.uid() = user1_id
);

-- Fix 2b: Remove anonymous access from swipes table
DROP POLICY IF EXISTS "Users can create their own swipes" ON public.swipes;

CREATE POLICY "Authenticated users create their own swipes"
ON public.swipes
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);

-- Fix 2c: Update matches policy to require authentication
DROP POLICY IF EXISTS "Users can view matches in their room" ON public.matches;

CREATE POLICY "Authenticated users view matches in their room"
ON public.matches
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = matches.room_id
    AND (rooms.user1_id = auth.uid() OR rooms.user2_id = auth.uid())
  )
);

-- Fix search_path for functions
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.check_for_match()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.action = 'like' THEN
    IF EXISTS (
      SELECT 1 FROM public.swipes
      WHERE room_id = NEW.room_id
      AND movie_id = NEW.movie_id
      AND action = 'like'
      AND user_id != NEW.user_id
      GROUP BY room_id, movie_id
      HAVING COUNT(DISTINCT user_id) >= 2
    ) THEN
      INSERT INTO public.matches (room_id, movie_id)
      VALUES (NEW.room_id, NEW.movie_id)
      ON CONFLICT (room_id, movie_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;