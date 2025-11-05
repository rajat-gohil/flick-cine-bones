import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Camera } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    username: "",
    display_name: "",
    age: "",
    sex: "",
    phone: "",
    avatar_url: "",
    bio: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        username: data.username || "",
        display_name: data.display_name || "",
        age: data.age?.toString() || "",
        sex: data.sex || "",
        phone: data.phone || "",
        avatar_url: data.avatar_url || "",
        bio: data.bio || "",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: profile.username,
          display_name: profile.display_name,
          age: profile.age ? parseInt(profile.age) : null,
          sex: profile.sex,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile.display_name?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <Label>Avatar URL</Label>
                <div className="relative">
                  <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-10"
                    value={profile.avatar_url}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="pl-10"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  placeholder="John Doe"
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Gender</Label>
                <Select value={profile.sex} onValueChange={(value) => setProfile({ ...profile, sex: value })}>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={user?.email || ""}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="pl-10"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;