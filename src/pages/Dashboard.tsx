import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, MessageSquare, Users, Settings, Scan } from "lucide-react";
import { useSOS } from "@/contexts/SOSContext";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { useKeyboardSOS } from "@/hooks/useKeyboardSOS";
import DisguisedHeader from "@/components/DisguisedHeader";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [safetyScore, setSafetyScore] = useState(85);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const { activateSOS, settings } = useSOS();

  // Shake detection for SOS (only if enabled)
  useShakeDetection({
    threshold: 20,
    onShake: () => {
      if (settings.shake_sos_enabled) {
        activateSOS('shake');
      }
    },
  });

  // Keyboard SOS (type "sos") - only if enabled
  useKeyboardSOS({
    pattern: ['s', 'o', 's'],
    onSOS: () => {
      if (settings.keyboard_sos_enabled) {
        activateSOS('keyboard');
      }
    },
  });

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DisguisedHeader showBack backTo="/" />

      <main className="container mx-auto px-4 py-6 max-w-4xl flex-1">
        {/* Safety Score */}
        <Card className="mb-4 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Safety Score</p>
                <div className="text-4xl font-bold text-primary">{safetyScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Your digital safety is strong</p>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center bg-primary/5">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{safetyScore}</div>
                  <div className="text-[10px] text-muted-foreground">Protected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={() => navigate("/detection")}
            size="lg"
            className="h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
          >
            <Scan className="w-5 h-5 mr-2" />
            Scan Messages
          </Button>
          <Button
            onClick={() => activateSOS()}
            size="lg"
            variant="destructive"
            className="h-16 text-sm"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            SOS Emergency
          </Button>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/evidence")}
          >
            <CardHeader className="pb-2 pt-3 px-3">
              <FileText className="w-6 h-6 text-primary mb-1" />
              <CardTitle className="text-sm">Evidence Vault</CardTitle>
              <CardDescription className="text-xs">{evidenceCount} items</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/coach")}
          >
            <CardHeader className="pb-2 pt-3 px-3">
              <MessageSquare className="w-6 h-6 text-primary mb-1" />
              <CardTitle className="text-sm">Safety Coach</CardTitle>
              <CardDescription className="text-xs">AI guidance</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/contacts")}
          >
            <CardHeader className="pb-2 pt-3 px-3">
              <Users className="w-6 h-6 text-primary mb-1" />
              <CardTitle className="text-sm">Safe Circle</CardTitle>
              <CardDescription className="text-xs">Trusted contacts</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/settings")}
          >
            <CardHeader className="pb-2 pt-3 px-3">
              <Settings className="w-6 h-6 text-primary mb-1" />
              <CardTitle className="text-sm">Settings</CardTitle>
              <CardDescription className="text-xs">Safety options</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 border border-border"
                  >
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{alert.message}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4 text-xs">
                No recent alerts. You're safe! 🛡️
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick tip about SOS */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Shake your phone or type "SOS" to activate emergency mode
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
