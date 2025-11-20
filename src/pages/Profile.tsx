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
import { z } from "zod";

const profileSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").optional().or(z.literal("")),
  display_name: z.string().trim().min(1, "Display name is required").max(100, "Display name must be less than 100 characters"),
  age: z.number().int().min(13, "Must be at least 13 years old").max(120, "Please enter a valid age").optional().nullable(),
  sex: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional().nullable(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number with country code").optional().or(z.literal("")),
  avatar_url: z.string().url("Please enter a valid URL").max(500, "URL must be less than 500 characters").optional().or(z.literal("")),
  bio: z.string().trim().max(500, "Bio must be less than 500 characters").optional().or(z.literal(""))
});

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
      // Validate input data
      const validatedProfile = profileSchema.parse({
        username: profile.username || "",
        display_name: profile.display_name,
        age: profile.age ? parseInt(profile.age) : null,
        sex: profile.sex || null,
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || "",
        bio: profile.bio || ""
      });

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: validatedProfile.username || null,
          display_name: validatedProfile.display_name,
          age: validatedProfile.age,
          sex: validatedProfile.sex,
          phone: validatedProfile.phone || null,
          avatar_url: validatedProfile.avatar_url || null,
          bio: validatedProfile.bio || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error(error.message);
      }
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