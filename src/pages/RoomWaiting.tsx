import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Copy, Check } from "lucide-react";

const RoomWaiting = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");
  const [copied, setCopied] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    if (!roomCode) {
      navigate("/room");
      return;
    }
    loadRoomData();
    subscribeToRoom();
  }, [roomCode]);

  const loadRoomData = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", roomCode)
      .single();

    if (error) {
      toast.error("Room not found");
      navigate("/room");
      return;
    }

    setRoom(data);
    const count = [data.user1_id, data.user2_id].filter(Boolean).length;
    setParticipants(count);

    // If both users are in, navigate to swipe
    if (count >= 2) {
      navigate(`/swipe?room=${roomCode}`);
    }
  };

  const subscribeToRoom = () => {
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `code=eq.${roomCode}`,
        },
        (payload) => {
          const updatedRoom = payload.new;
          const count = [updatedRoom.user1_id, updatedRoom.user2_id].filter(Boolean).length;
          setParticipants(count);
          
          if (count >= 2) {
            toast.success("Your friend joined! Starting...");
            setTimeout(() => navigate(`/swipe?room=${roomCode}`), 1000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode || "");
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = async () => {
    const shareUrl = `${window.location.origin}/room?join=${roomCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my movie matching room!",
          text: `Use code ${roomCode} to join`,
          url: shareUrl,
        });
      } catch (error) {
        copyRoomCode();
      }
    } else {
      copyRoomCode();
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Waiting Room</h1>
          <p className="text-muted-foreground">
            Share the code with your friend to start matching
          </p>
        </div>

        <Card className="border-2 border-primary/20 bg-card/50">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Room Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Room Code Display */}
            <div className="relative">
              <div className="text-center p-8 bg-primary/10 rounded-2xl border-2 border-primary/30">
                <p className="text-6xl font-bold tracking-wider text-primary font-mono">
                  {roomCode}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={copyRoomCode}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Participants Count */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${participants >= 1 ? "bg-green-500" : "bg-muted"}`} />
                <div className={`w-3 h-3 rounded-full ${participants >= 2 ? "bg-green-500" : "bg-muted"}`} />
              </div>
              <p className="text-sm text-muted-foreground">
                {participants} of 2 participants ready
              </p>
            </div>

            {/* Genre Info */}
            {room?.genre && (
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Genre</p>
                <p className="text-lg font-semibold text-primary">{room.genre}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={shareRoom} className="w-full" size="lg">
                Share Room Code
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/room")}
                className="w-full"
              >
                Cancel
              </Button>
            </div>

            {/* Waiting Animation */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Waiting for friend</span>
                <span className="animate-pulse">.</span>
                <span className="animate-pulse animation-delay-200">.</span>
                <span className="animate-pulse animation-delay-400">.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoomWaiting;