import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Users, Hash } from "lucide-react";

const RoomSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "join">("create");
  const [roomCode, setRoomCode] = useState("");
  const [genre, setGenre] = useState("");

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Animation",
    "Documentary",
  ];

  const createRoom = async () => {
    setLoading(true);
    try {
      // Generate room code
      const { data: codeData, error: codeError } = await supabase.rpc("generate_room_code");
      
      if (codeError) throw codeError;

      const code = codeData as string;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Create room
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          code,
          genre,
          user1_id: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Room created! Code: ${code}`);
      localStorage.setItem("roomId", data.id);
      localStorage.setItem("sessionId", crypto.randomUUID());
      navigate(`/swipe?room=${code}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    setLoading(true);
    try {
      // Find room by code
      const { data: room, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode.toUpperCase())
        .single();

      if (fetchError) throw new Error("Room not found");

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Update room with second user
      if (!room.user2_id) {
        const { error: updateError } = await supabase
          .from("rooms")
          .update({ user2_id: user?.id || null })
          .eq("id", room.id);

        if (updateError) throw updateError;
      }

      toast.success("Joined room successfully!");
      localStorage.setItem("roomId", room.id);
      localStorage.setItem("sessionId", crypto.randomUUID());
      navigate(`/swipe?room=${roomCode.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Movie Matching</h1>
          <p className="text-muted-foreground">
            Create or join a room to start matching
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={mode === "create" ? "default" : "outline"}
            onClick={() => setMode("create")}
            className="w-full"
          >
            Create Room
          </Button>
          <Button
            variant={mode === "join" ? "default" : "outline"}
            onClick={() => setMode("join")}
            className="w-full"
          >
            Join Room
          </Button>
        </div>

        {mode === "create" ? (
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Create a Room
              </CardTitle>
              <CardDescription>
                Choose a genre and get a code to share
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre Preference</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={createRoom}
                className="w-full"
                disabled={loading || !genre}
              >
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-primary" />
                Join a Room
              </CardTitle>
              <CardDescription>
                Enter the room code from your friend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Room Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="ABC123"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-2xl font-bold tracking-wider"
                />
              </div>

              <Button
                onClick={joinRoom}
                className="w-full"
                disabled={loading || roomCode.length !== 6}
              >
                {loading ? "Joining..." : "Join Room"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoomSetup;
