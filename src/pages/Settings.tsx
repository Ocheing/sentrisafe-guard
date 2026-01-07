import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, User, Bell, Shield, Moon, Smartphone, Lock, LogOut, 
  Eye, MessageSquare, MapPin, Mic, Trash2, Vibrate 
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Footer from "@/components/Footer";
import DisguiseSelector from "@/components/DisguiseSelector";
import PrewrittenMessagesManager from "@/components/PrewrittenMessagesManager";
import SelfDestructButton from "@/components/SelfDestructButton";
import { useDisguise } from "@/contexts/DisguiseContext";
import { useSOS } from "@/contexts/SOSContext";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isDisguised, appName } = useDisguise();
  const { settings, updateSettings, loading: sosLoading } = useSOS();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setProfile({ name: data.name, email: data.email });
      }
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ name: profile.name })
        .eq("id", user.id);

      if (error) {
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-1">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            Settings
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-2xl flex-1">
        <Tabs defaultValue="safety" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="safety" className="text-xs">Safety</TabsTrigger>
            <TabsTrigger value="disguise" className="text-xs">Disguise</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs">Privacy</TabsTrigger>
          </TabsList>

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-4">
            {/* SOS Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  SOS Triggers
                </CardTitle>
                <CardDescription className="text-xs">Configure how to activate SOS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vibrate className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Shake to SOS</p>
                      <p className="text-xs text-muted-foreground">Shake phone 3 times</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.shake_sos_enabled}
                    onCheckedChange={(checked) => updateSettings({ shake_sos_enabled: checked })}
                    disabled={sosLoading}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Keyboard SOS</p>
                      <p className="text-xs text-muted-foreground">Type "SOS" quickly</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.keyboard_sos_enabled}
                    onCheckedChange={(checked) => updateSettings({ keyboard_sos_enabled: checked })}
                    disabled={sosLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Auto Features */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Automatic Features
                </CardTitle>
                <CardDescription className="text-xs">What happens when SOS activates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Share Location</p>
                      <p className="text-xs text-muted-foreground">Send GPS to contacts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.auto_location_enabled}
                    onCheckedChange={(checked) => updateSettings({ auto_location_enabled: checked })}
                    disabled={sosLoading}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Audio Recording</p>
                      <p className="text-xs text-muted-foreground">Record when SOS active</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.auto_recording_enabled}
                    onCheckedChange={(checked) => updateSettings({ auto_recording_enabled: checked })}
                    disabled={sosLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pre-written Messages */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Pre-written Messages
                </CardTitle>
                <CardDescription className="text-xs">Quick messages for emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                <PrewrittenMessagesManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disguise Tab */}
          <TabsContent value="disguise" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  App Disguise
                </CardTitle>
                <CardDescription className="text-xs">
                  Make the app look like something else
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DisguiseSelector />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Current: <strong>{appName}</strong>
                </p>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Switch themes</p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="h-9 text-sm bg-muted"
                  />
                </div>
                <Button onClick={updateProfile} disabled={loading} size="sm" className="w-full">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Email Notifications</p>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Push Notifications</p>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Two-Factor Auth
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="border-destructive/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Emergency Data Wipe
                </CardTitle>
                <CardDescription className="text-xs">
                  Instantly delete all your data if needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SelfDestructButton />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This cannot be undone
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Data & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Download My Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">About {isDisguised ? appName : 'SentriSafe'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Version:</strong> 1.0.0</p>
                <p><strong className="text-foreground">Mission:</strong> Protecting women and girls from online violence.</p>
                <p className="text-primary italic">"Safety is not optional — it is designed."</p>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
