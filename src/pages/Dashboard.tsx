import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, FileText, MessageSquare, Users, Settings, LogOut, Scan, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [safetyScore, setSafetyScore] = useState(85);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [evidenceCount, setEvidenceCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: alertsData } = await supabase
      .from("safety_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    const { count } = await supabase
      .from("evidence")
      .select("*", { count: "exact", head: true });

    setAlerts(alertsData || []);
    setEvidenceCount(count || 0);
  };

  const handleSOS = async () => {
    toast.success("SOS alert sent to your trusted contacts!");
    // Create an alert
    await supabase.from("safety_alerts").insert({
      alert_type: "sos",
      message: "Emergency SOS activated",
      risk_level: "critical",
      user_id: user?.id,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">SentriSafe</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/settings")}
              className="rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Safety Score */}
        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Safety Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-bold text-primary">{safetyScore}</div>
                <p className="text-muted-foreground mt-1">Your digital safety is strong</p>
              </div>
              <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{safetyScore}%</div>
                  <div className="text-xs text-muted-foreground">Protected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => navigate("/detection")}
            size="lg"
            className="h-24 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Scan className="w-6 h-6 mr-3" />
            <span className="text-lg font-semibold">Scan Messages</span>
          </Button>
          <Button
            onClick={handleSOS}
            size="lg"
            variant="destructive"
            className="h-24"
          >
            <AlertTriangle className="w-6 h-6 mr-3" />
            <span className="text-lg font-semibold">SOS Emergency</span>
          </Button>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2"
            onClick={() => navigate("/evidence")}
          >
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Evidence Vault</CardTitle>
              <CardDescription>{evidenceCount} items stored</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2"
            onClick={() => navigate("/coach")}
          >
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Safety Coach</CardTitle>
              <CardDescription>Get AI guidance</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2"
            onClick={() => navigate("/contacts")}
          >
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Safe Circle</CardTitle>
              <CardDescription>Trusted contacts</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2"
            onClick={() => navigate("/detection")}
          >
            <CardHeader>
              <Scan className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Detect Abuse</CardTitle>
              <CardDescription>Scan messages now</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Your latest safety notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{alert.message}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent alerts. You're safe! 🛡️
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
